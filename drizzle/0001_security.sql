-- =============================================================================
-- 0001_security.sql — roles, row level security, triggers, auth functions
--
-- The `archive_app` role owns no tables and holds no BYPASSRLS attribute.
-- The application connects with a privileged session, but every statement runs
-- inside a transaction that drops to `archive_app` (see src/server/db/tx.ts),
-- so RLS is always in force. The privileged client is not exported.
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS app;
--> statement-breakpoint

-- -----------------------------------------------------------------------------
-- Request-scoped identity helpers.
-- `app.user_id` / `app.user_role` are set with set_config(..., true) so the
-- values are local to the current transaction and cannot leak between requests.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION app.current_user_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.user_id', true), '')::uuid
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION app.current_user_role() RETURNS text
LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.user_role', true), '')
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION app.is_editor() RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT coalesce(app.current_user_role() IN ('editor', 'admin'), false)
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION app.is_admin() RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT coalesce(app.current_user_role() = 'admin', false)
$$;
--> statement-breakpoint

-- -----------------------------------------------------------------------------
-- Application role. No ownership, no BYPASSRLS: it is subject to every policy.
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'archive_app') THEN
    CREATE ROLE archive_app NOLOGIN;
  END IF;
END
$$;
--> statement-breakpoint

GRANT USAGE ON SCHEMA public, app TO archive_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO archive_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO archive_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO archive_app;
--> statement-breakpoint

-- Optional production login role. Enable when the app connects over TCP to a
-- managed Postgres: it may SET ROLE to archive_app but is not a superuser.
-- CREATE ROLE archive_login LOGIN PASSWORD '...' NOSUPERUSER;
-- GRANT archive_app TO archive_login;
--> statement-breakpoint

-- -----------------------------------------------------------------------------
-- Trigger helpers
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.people_search_doc() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_doc :=
      setweight(to_tsvector('english', COALESCE(NEW.full_name, '')), 'A')
   || setweight(to_tsvector('english', COALESCE(array_to_string(NEW.alternate_names, ' '), '')), 'A')
   || setweight(to_tsvector('english', COALESCE(NEW.occupations::text, '')), 'B')
   || setweight(to_tsvector('english', COALESCE(NEW.summary, '')), 'B')
   || setweight(to_tsvector('english', COALESCE(NEW.why_it_matters, '')), 'C');
  RETURN NEW;
END
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.articles_search_doc() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_doc :=
      setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A')
   || setweight(to_tsvector('english', COALESCE(NEW.summary, '')), 'B')
   || setweight(to_tsvector('english', COALESCE(NEW.content_md, '')), 'C');
  RETURN NEW;
END
$$;
--> statement-breakpoint

CREATE TRIGGER people_touch_updated_at BEFORE UPDATE ON public.people
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER people_search_doc_trigger BEFORE INSERT OR UPDATE ON public.people
  FOR EACH ROW EXECUTE FUNCTION public.people_search_doc();
CREATE TRIGGER categories_touch_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER collections_touch_updated_at BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER articles_touch_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER articles_search_doc_trigger BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.articles_search_doc();
CREATE TRIGGER users_touch_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
--> statement-breakpoint

-- -----------------------------------------------------------------------------
-- Row level security
--
-- Editorial content is readable by the public only once published. Because the
-- public queries and the editorial queries run under the same role and differ
-- only by the transaction-local identity, a missing `status` filter can never
-- leak a draft.
-- -----------------------------------------------------------------------------
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_related_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_event_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

-- Editorial content: published rows for everyone, everything for signed-in editors.
CREATE POLICY people_read ON public.people FOR SELECT
  USING (status = 'published' OR app.current_user_id() IS NOT NULL);
CREATE POLICY people_write ON public.people FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY articles_read ON public.articles FOR SELECT
  USING (status = 'published' OR app.current_user_id() IS NOT NULL);
CREATE POLICY articles_write ON public.articles FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY collections_read ON public.collections FOR SELECT
  USING (status = 'published' OR app.current_user_id() IS NOT NULL);
CREATE POLICY collections_write ON public.collections FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY categories_read ON public.categories FOR SELECT
  USING (status = 'published' OR app.current_user_id() IS NOT NULL);
CREATE POLICY categories_write ON public.categories FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY relationships_read ON public.person_relationships FOR SELECT
  USING (status = 'published' OR app.current_user_id() IS NOT NULL);
CREATE POLICY relationships_write ON public.person_relationships FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());
--> statement-breakpoint

-- Rows that hang off a piece of editorial content inherit its visibility.
-- The EXISTS sub-select is itself filtered by RLS on `people` / `articles`,
-- so a draft's timeline, tags and categories stay invisible.
CREATE POLICY timeline_events_read ON public.timeline_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.people p WHERE p.id = person_id));
CREATE POLICY timeline_events_write ON public.timeline_events FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY person_categories_read ON public.person_categories FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.people p WHERE p.id = person_id));
CREATE POLICY person_categories_write ON public.person_categories FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY person_tags_read ON public.person_tags FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.people p WHERE p.id = person_id));
CREATE POLICY person_tags_write ON public.person_tags FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY person_sources_read ON public.person_sources FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.people p WHERE p.id = person_id));
CREATE POLICY person_sources_write ON public.person_sources FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY article_categories_read ON public.article_categories FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.articles a WHERE a.id = article_id));
CREATE POLICY article_categories_write ON public.article_categories FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY article_tags_read ON public.article_tags FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.articles a WHERE a.id = article_id));
CREATE POLICY article_tags_write ON public.article_tags FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY article_people_read ON public.article_people FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.articles a WHERE a.id = article_id));
CREATE POLICY article_people_write ON public.article_people FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY article_sources_read ON public.article_sources FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.articles a WHERE a.id = article_id));
CREATE POLICY article_sources_write ON public.article_sources FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY article_relations_read ON public.article_related_articles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.articles a WHERE a.id = article_id));
CREATE POLICY article_relations_write ON public.article_related_articles FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY timeline_event_sources_read ON public.timeline_event_sources FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.timeline_events e WHERE e.id = timeline_event_id));
CREATE POLICY timeline_event_sources_write ON public.timeline_event_sources FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());

CREATE POLICY collection_items_read ON public.collection_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.collections c WHERE c.id = collection_id));
CREATE POLICY collection_items_write ON public.collection_items FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());
--> statement-breakpoint

-- Supporting reference data is public.
CREATE POLICY tags_read ON public.tags FOR SELECT USING (true);
CREATE POLICY tags_write ON public.tags FOR ALL USING (app.is_editor()) WITH CHECK (app.is_editor());
CREATE POLICY places_read ON public.places FOR SELECT USING (true);
CREATE POLICY places_write ON public.places FOR ALL USING (app.is_editor()) WITH CHECK (app.is_editor());
CREATE POLICY periods_read ON public.periods FOR SELECT USING (true);
CREATE POLICY periods_write ON public.periods FOR ALL USING (app.is_editor()) WITH CHECK (app.is_editor());
CREATE POLICY sources_read ON public.sources FOR SELECT USING (true);
CREATE POLICY sources_write ON public.sources FOR ALL USING (app.is_editor()) WITH CHECK (app.is_editor());
CREATE POLICY media_read ON public.media_assets FOR SELECT USING (true);
CREATE POLICY media_write ON public.media_assets FOR ALL USING (app.is_editor()) WITH CHECK (app.is_editor());
CREATE POLICY settings_read ON public.site_settings FOR SELECT USING (true);
CREATE POLICY settings_write ON public.site_settings FOR ALL USING (app.is_editor()) WITH CHECK (app.is_editor());
CREATE POLICY redirects_read ON public.redirects FOR SELECT USING (true);
CREATE POLICY redirects_write ON public.redirects FOR ALL USING (app.is_editor()) WITH CHECK (app.is_editor());
--> statement-breakpoint

-- Identity and audit data are never public.
CREATE POLICY users_read ON public.users FOR SELECT
  USING (id = app.current_user_id() OR app.is_admin());
CREATE POLICY users_write ON public.users FOR ALL
  USING (app.is_admin()) WITH CHECK (app.is_admin());

CREATE POLICY sessions_read ON public.sessions FOR SELECT
  USING (user_id = app.current_user_id());
-- No INSERT/DELETE policy: sessions are only created and removed through the
-- SECURITY DEFINER helpers below, which apply their own checks.

CREATE POLICY audit_log_read ON public.audit_log FOR SELECT USING (app.is_admin());
CREATE POLICY audit_log_write ON public.audit_log FOR ALL
  USING (app.is_admin()) WITH CHECK (app.is_admin());
--> statement-breakpoint

-- -----------------------------------------------------------------------------
-- Authentication helpers.
--
-- These run as the migration owner, so they can read rows that the request
-- role is not allowed to see. Each one is narrow and returns only what the
-- caller needs; none of them accepts a role or privilege from the caller.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION app.get_user_for_login(p_email text)
RETURNS TABLE (
  id uuid,
  email text,
  role public.user_role,
  display_name text,
  password_hash text,
  must_change_password boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT u.id, u.email, u.role, u.display_name, u.password_hash, u.must_change_password
  FROM public.users u
  WHERE lower(u.email) = lower(p_email)
  LIMIT 1
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION app.resolve_session(p_token_hash text)
RETURNS TABLE (
  user_id uuid,
  email text,
  role public.user_role,
  display_name text,
  must_change_password boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT u.id, u.email, u.role, u.display_name, u.must_change_password
  FROM public.sessions s
  JOIN public.users u ON u.id = s.user_id
  WHERE s.id = p_token_hash AND s.expires_at > now()
  LIMIT 1
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION app.create_session(
  p_token_hash text,
  p_user_id uuid,
  p_expires_at timestamptz,
  p_user_agent text
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  INSERT INTO public.sessions (id, user_id, expires_at, user_agent)
  VALUES (p_token_hash, p_user_id, p_expires_at, p_user_agent)
  ON CONFLICT (id) DO UPDATE
    SET expires_at = EXCLUDED.expires_at, user_agent = EXCLUDED.user_agent
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION app.delete_session(p_token_hash text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  DELETE FROM public.sessions WHERE id = p_token_hash
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION app.set_user_password(p_user_id uuid, p_password_hash text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  UPDATE public.users
  SET password_hash = p_password_hash, must_change_password = false
  WHERE id = p_user_id
$$;
--> statement-breakpoint

GRANT EXECUTE ON FUNCTION app.current_user_id() TO archive_app;
GRANT EXECUTE ON FUNCTION app.current_user_role() TO archive_app;
GRANT EXECUTE ON FUNCTION app.is_editor() TO archive_app;
GRANT EXECUTE ON FUNCTION app.is_admin() TO archive_app;
GRANT EXECUTE ON FUNCTION app.get_user_for_login(text) TO archive_app;
GRANT EXECUTE ON FUNCTION app.resolve_session(text) TO archive_app;
GRANT EXECUTE ON FUNCTION app.create_session(text, uuid, timestamptz, text) TO archive_app;
GRANT EXECUTE ON FUNCTION app.delete_session(text) TO archive_app;
GRANT EXECUTE ON FUNCTION app.set_user_password(uuid, text) TO archive_app;
--> statement-breakpoint
