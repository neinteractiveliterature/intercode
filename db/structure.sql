SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: anything_bucket_keys(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.anything_bucket_keys(registration_policy jsonb) RETURNS text[]
    LANGUAGE sql
    AS $$
    SELECT ARRAY_AGG(key) FROM registration_policy_buckets(registration_policy)
    WHERE anything = 't'
  $$;


--
-- Name: bucket_keys(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.bucket_keys(registration_policy jsonb) RETURNS text[]
    LANGUAGE sql
    AS $$
    SELECT ARRAY_AGG(key) FROM registration_policy_buckets(registration_policy)
  $$;


--
-- Name: bucket_minimum_slots(jsonb, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.bucket_minimum_slots(registration_policy jsonb, bucket_key text) RETURNS bigint
    LANGUAGE sql
    AS $$
    SELECT (registration_bucket(registration_policy, bucket_key)->>'minimum_slots')::bigint
  $$;


--
-- Name: bucket_preferred_slots(jsonb, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.bucket_preferred_slots(registration_policy jsonb, bucket_key text) RETURNS bigint
    LANGUAGE sql
    AS $$
    SELECT (registration_bucket(registration_policy, bucket_key)->>'preferred_slots')::bigint
  $$;


--
-- Name: bucket_total_slots(jsonb, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.bucket_total_slots(registration_policy jsonb, bucket_key text) RETURNS bigint
    LANGUAGE sql
    AS $$
    SELECT (registration_bucket(registration_policy, bucket_key)->>'total_slots')::bigint
  $$;


--
-- Name: counted_bucket_keys(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.counted_bucket_keys(registration_policy jsonb) RETURNS text[]
    LANGUAGE sql
    AS $$
    SELECT ARRAY_AGG(key) FROM registration_policy_buckets(registration_policy)
    WHERE not_counted = 'f'
  $$;


--
-- Name: current_scheduled_value(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.current_scheduled_value(scheduled_value jsonb) RETURNS jsonb
    LANGUAGE sql
    AS $$
    SELECT current_scheduled_value_timespan(scheduled_value)->'value'
  $$;


--
-- Name: current_scheduled_value_timespan(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.current_scheduled_value_timespan(scheduled_value jsonb) RETURNS jsonb
    LANGUAGE sql
    AS $$
    SELECT scheduled_value_timespan_at(scheduled_value, now()::timestamp)
  $$;


--
-- Name: minimum_all_slots(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.minimum_all_slots(registration_policy jsonb) RETURNS bigint
    LANGUAGE sql
    AS $$
    SELECT COALESCE(SUM(minimum_slots), 0) FROM registration_policy_buckets(registration_policy)
  $$;


--
-- Name: minimum_counted_slots(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.minimum_counted_slots(registration_policy jsonb) RETURNS bigint
    LANGUAGE sql
    AS $$
    SELECT COALESCE(SUM(minimum_slots), 0) FROM registration_policy_buckets(registration_policy)
    WHERE not_counted = 'f'
  $$;


--
-- Name: minimum_not_counted_slots(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.minimum_not_counted_slots(registration_policy jsonb) RETURNS bigint
    LANGUAGE sql
    AS $$
    SELECT COALESCE(SUM(minimum_slots), 0) FROM registration_policy_buckets(registration_policy)
    WHERE not_counted = 't'
  $$;


--
-- Name: next_scheduled_value(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.next_scheduled_value(scheduled_value jsonb) RETURNS jsonb
    LANGUAGE sql
    AS $$
    SELECT next_scheduled_value_timespan(scheduled_value)->'value'
  $$;


--
-- Name: next_scheduled_value_at(jsonb, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.next_scheduled_value_at(scheduled_value jsonb, target_time timestamp without time zone) RETURNS jsonb
    LANGUAGE sql
    AS $$
    SELECT next_scheduled_value_timespan_at(scheduled_value, target_time)->'value'
  $$;


--
-- Name: next_scheduled_value_change(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.next_scheduled_value_change(scheduled_value jsonb) RETURNS timestamp without time zone
    LANGUAGE sql
    AS $$
    SELECT (next_scheduled_value_timespan(scheduled_value)->>'start')::timestamp
  $$;


--
-- Name: next_scheduled_value_change_at(jsonb, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.next_scheduled_value_change_at(scheduled_value jsonb, target_time timestamp without time zone) RETURNS timestamp without time zone
    LANGUAGE sql
    AS $$
    SELECT (next_scheduled_value_timespan_at(scheduled_value, target_time)->>'start')::timestamp
  $$;


--
-- Name: next_scheduled_value_timespan(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.next_scheduled_value_timespan(scheduled_value jsonb) RETURNS jsonb
    LANGUAGE sql
    AS $$
    SELECT next_scheduled_value_timespan_at(scheduled_value, now()::timestamp)
  $$;


--
-- Name: next_scheduled_value_timespan_at(jsonb, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.next_scheduled_value_timespan_at(scheduled_value jsonb, target_time timestamp without time zone) RETURNS jsonb
    LANGUAGE sql
    AS $$
    SELECT to_jsonb(timespan) FROM (
      SELECT * FROM scheduled_value_timespans(scheduled_value) timespans
      WHERE timespan_index = (scheduled_value_timespan_at(scheduled_value, target_time)->>'timespan_index')::bigint + 1
      LIMIT 1
    ) timespan
  $$;


--
-- Name: not_counted_bucket_keys(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.not_counted_bucket_keys(registration_policy jsonb) RETURNS text[]
    LANGUAGE sql
    AS $$
    SELECT ARRAY_AGG(key) FROM registration_policy_buckets(registration_policy)
    WHERE not_counted = 't'
  $$;


--
-- Name: preferred_all_slots(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.preferred_all_slots(registration_policy jsonb) RETURNS bigint
    LANGUAGE sql
    AS $$
    SELECT COALESCE(SUM(preferred_slots), 0) FROM registration_policy_buckets(registration_policy)
  $$;


--
-- Name: preferred_counted_slots(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.preferred_counted_slots(registration_policy jsonb) RETURNS bigint
    LANGUAGE sql
    AS $$
    SELECT COALESCE(SUM(preferred_slots), 0) FROM registration_policy_buckets(registration_policy)
    WHERE not_counted = 'f'
  $$;


--
-- Name: preferred_not_counted_slots(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.preferred_not_counted_slots(registration_policy jsonb) RETURNS bigint
    LANGUAGE sql
    AS $$
    SELECT COALESCE(SUM(preferred_slots), 0) FROM registration_policy_buckets(registration_policy)
    WHERE not_counted = 't'
  $$;


--
-- Name: registration_bucket(jsonb, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.registration_bucket(registration_policy jsonb, bucket_key text) RETURNS jsonb
    LANGUAGE sql
    AS $$
    SELECT to_jsonb(bucket) FROM (
      SELECT * FROM registration_policy_buckets(registration_policy)
      WHERE key = bucket_key
      LIMIT 1
    ) bucket
  $$;


--
-- Name: registration_policy_buckets(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.registration_policy_buckets(registration_policy jsonb) RETURNS TABLE(bucket_index bigint, key text, name text, description text, minimum_slots integer, preferred_slots integer, total_slots integer, anything boolean, not_counted boolean, expose_attendees boolean)
    LANGUAGE sql
    AS $$
    SELECT
      row_number() over() AS bucket_index,
      bucket->>'key' AS key,
      bucket->>'name' AS name,
      bucket->>'description' AS description,
      (bucket->>'minimum_slots')::int AS minimum_slots,
      (bucket->>'preferred_slots')::int AS preferred_slots,
      (bucket->>'total_slots')::int AS total_slots,
      (bucket->>'anything' IS NOT NULL AND bucket->>'anything' = 'true') AS anything,
      (bucket->>'not_counted' IS NOT NULL AND bucket->>'not_counted' = 'true') AS not_counted,
      (bucket->>'expose_attendees' IS NOT NULL AND bucket->>'expose_attendees' = 'true') AS expose_attendees
    FROM (
      SELECT jsonb_array_elements(registration_policy->'buckets') AS bucket
    ) buckets
  $$;


--
-- Name: scheduled_value_at(jsonb, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.scheduled_value_at(scheduled_value jsonb, target_time timestamp without time zone) RETURNS jsonb
    LANGUAGE sql
    AS $$
    SELECT scheduled_value_timespan_at(scheduled_value, target_time)->'value'
  $$;


--
-- Name: scheduled_value_timespan_at(jsonb, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.scheduled_value_timespan_at(scheduled_value jsonb, target_time timestamp without time zone) RETURNS jsonb
    LANGUAGE sql
    AS $$
    SELECT to_jsonb(timespan) FROM (
      SELECT * FROM scheduled_value_timespans(scheduled_value) timespans
      WHERE
        (start IS NULL AND finish > target_time)
        OR (start <= target_time AND finish > target_time)
        OR (start <= target_time AND finish IS NULL)
        OR (start IS NULL AND finish IS NULL)
      LIMIT 1
    ) timespan
  $$;


--
-- Name: scheduled_value_timespans(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.scheduled_value_timespans(scheduled_value jsonb) RETURNS TABLE(timespan_index bigint, start timestamp without time zone, finish timestamp without time zone, value jsonb)
    LANGUAGE sql
    AS $$
    SELECT
      row_number() over() AS timespan_index,
      (timespan->>'start')::timestamp AS start,
      (timespan->>'finish')::timestamp AS finish,
      timespan->'value' AS value
    FROM (
      SELECT jsonb_array_elements(scheduled_value->'timespans') AS timespan
    ) timespans
    ORDER BY (CASE WHEN timespan->>'start' IS NULL THEN 0 ELSE 1 END), (timespan->>'start')::timestamp
  $$;


--
-- Name: total_all_slots(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.total_all_slots(registration_policy jsonb) RETURNS bigint
    LANGUAGE sql
    AS $$
    SELECT COALESCE(SUM(total_slots), 0) FROM registration_policy_buckets(registration_policy)
  $$;


--
-- Name: total_counted_slots(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.total_counted_slots(registration_policy jsonb) RETURNS bigint
    LANGUAGE sql
    AS $$
    SELECT COALESCE(SUM(total_slots), 0) FROM registration_policy_buckets(registration_policy)
    WHERE not_counted = 'f'
  $$;


--
-- Name: total_not_counted_slots(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.total_not_counted_slots(registration_policy jsonb) RETURNS bigint
    LANGUAGE sql
    AS $$
    SELECT COALESCE(SUM(total_slots), 0) FROM registration_policy_buckets(registration_policy)
    WHERE not_counted = 't'
  $$;


--
-- Name: english_unaccent; Type: TEXT SEARCH CONFIGURATION; Schema: public; Owner: -
--

CREATE TEXT SEARCH CONFIGURATION public.english_unaccent (
    PARSER = pg_catalog."default" );

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR asciiword WITH english_stem;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR word WITH public.unaccent, english_stem;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR numword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR email WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR url WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR host WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR sfloat WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR version WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR hword_numpart WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR hword_part WITH public.unaccent, english_stem;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR hword_asciipart WITH english_stem;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR numhword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR asciihword WITH english_stem;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR hword WITH public.unaccent, english_stem;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR url_path WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR file WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR "float" WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR "int" WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.english_unaccent
    ADD MAPPING FOR uint WITH simple;


--
-- Name: simple_unaccent; Type: TEXT SEARCH CONFIGURATION; Schema: public; Owner: -
--

CREATE TEXT SEARCH CONFIGURATION public.simple_unaccent (
    PARSER = pg_catalog."default" );

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR asciiword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR word WITH public.unaccent, simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR numword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR email WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR url WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR host WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR sfloat WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR version WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR hword_numpart WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR hword_part WITH public.unaccent, simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR hword_asciipart WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR numhword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR asciihword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR hword WITH public.unaccent, simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR url_path WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR file WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR "float" WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR "int" WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
    ADD MAPPING FOR uint WITH simple;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ahoy_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ahoy_events (
    id bigint NOT NULL,
    visit_id bigint,
    user_id bigint,
    name character varying,
    properties jsonb,
    "time" timestamp without time zone
);


--
-- Name: ahoy_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ahoy_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ahoy_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ahoy_events_id_seq OWNED BY public.ahoy_events.id;


--
-- Name: ahoy_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ahoy_visits (
    id bigint NOT NULL,
    visit_token character varying,
    visitor_token character varying,
    user_id bigint,
    ip character varying,
    user_agent text,
    referrer text,
    referring_domain character varying,
    landing_page text,
    browser character varying,
    os character varying,
    device_type character varying,
    country character varying,
    region character varying,
    city character varying,
    latitude double precision,
    longitude double precision,
    utm_source character varying,
    utm_medium character varying,
    utm_term character varying,
    utm_content character varying,
    utm_campaign character varying,
    app_version character varying,
    os_version character varying,
    platform character varying,
    started_at timestamp without time zone
);


--
-- Name: ahoy_visits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ahoy_visits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ahoy_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ahoy_visits_id_seq OWNED BY public.ahoy_visits.id;


--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: cms_content_group_associations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_content_group_associations (
    id bigint NOT NULL,
    content_type character varying NOT NULL,
    content_id bigint NOT NULL,
    cms_content_group_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: cms_content_group_associations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cms_content_group_associations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cms_content_group_associations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cms_content_group_associations_id_seq OWNED BY public.cms_content_group_associations.id;


--
-- Name: cms_content_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_content_groups (
    id bigint NOT NULL,
    name character varying NOT NULL,
    parent_type character varying,
    parent_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: cms_content_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cms_content_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cms_content_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cms_content_groups_id_seq OWNED BY public.cms_content_groups.id;


--
-- Name: cms_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_files (
    id integer NOT NULL,
    parent_id integer,
    uploader_id integer,
    file character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    parent_type character varying
);


--
-- Name: cms_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cms_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cms_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cms_files_id_seq OWNED BY public.cms_files.id;


--
-- Name: cms_files_layouts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_files_layouts (
    cms_file_id bigint NOT NULL,
    cms_layout_id bigint NOT NULL
);


--
-- Name: cms_files_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_files_pages (
    cms_file_id bigint NOT NULL,
    page_id bigint NOT NULL
);


--
-- Name: cms_graphql_queries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_graphql_queries (
    id bigint NOT NULL,
    parent_type character varying,
    parent_id bigint,
    identifier text,
    admin_notes text,
    query text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: cms_graphql_queries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cms_graphql_queries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cms_graphql_queries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cms_graphql_queries_id_seq OWNED BY public.cms_graphql_queries.id;


--
-- Name: cms_layouts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_layouts (
    id bigint NOT NULL,
    parent_type character varying,
    parent_id bigint,
    name text,
    content text,
    navbar_classes text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    admin_notes text
);


--
-- Name: cms_layouts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cms_layouts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cms_layouts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cms_layouts_id_seq OWNED BY public.cms_layouts.id;


--
-- Name: cms_layouts_partials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_layouts_partials (
    cms_partial_id bigint NOT NULL,
    cms_layout_id bigint NOT NULL
);


--
-- Name: cms_navigation_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_navigation_items (
    id bigint NOT NULL,
    title text,
    parent_type character varying,
    parent_id bigint,
    navigation_section_id bigint,
    page_id bigint,
    "position" integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: cms_navigation_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cms_navigation_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cms_navigation_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cms_navigation_items_id_seq OWNED BY public.cms_navigation_items.id;


--
-- Name: cms_partials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_partials (
    id integer NOT NULL,
    parent_id integer,
    name character varying NOT NULL,
    content text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    parent_type character varying,
    admin_notes text,
    invariant boolean DEFAULT false NOT NULL
);


--
-- Name: cms_partials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cms_partials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cms_partials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cms_partials_id_seq OWNED BY public.cms_partials.id;


--
-- Name: cms_partials_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_partials_pages (
    cms_partial_id bigint NOT NULL,
    page_id bigint NOT NULL
);


--
-- Name: cms_variables; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_variables (
    id bigint NOT NULL,
    parent_id bigint,
    key character varying(100) NOT NULL,
    value jsonb,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    parent_type character varying
);


--
-- Name: cms_variables_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cms_variables_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cms_variables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cms_variables_id_seq OWNED BY public.cms_variables.id;


--
-- Name: conventions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conventions (
    id integer NOT NULL,
    show_schedule character varying DEFAULT 'no'::character varying NOT NULL,
    accepting_proposals boolean,
    updated_by_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    starts_at timestamp without time zone,
    ends_at timestamp without time zone,
    root_page_id integer,
    name character varying,
    domain character varying NOT NULL,
    timezone_name character varying,
    maximum_event_signups jsonb,
    maximum_tickets integer,
    default_layout_id bigint,
    user_con_profile_form_id bigint,
    ticket_name character varying DEFAULT 'ticket'::character varying NOT NULL,
    event_mailing_list_domain text,
    stripe_publishable_key text,
    stripe_secret_key text,
    clickwrap_agreement text,
    show_event_list character varying DEFAULT 'no'::character varying NOT NULL,
    organization_id bigint,
    ticket_mode character varying DEFAULT 'disabled'::character varying NOT NULL,
    site_mode character varying DEFAULT 'convention'::character varying NOT NULL,
    signup_mode character varying DEFAULT 'self_service'::character varying NOT NULL,
    signup_requests_open boolean DEFAULT false NOT NULL,
    email_from text NOT NULL,
    catch_all_staff_position_id bigint,
    email_mode character varying DEFAULT 'forward'::character varying NOT NULL,
    canceled boolean DEFAULT false NOT NULL,
    location jsonb,
    timezone_mode character varying NOT NULL,
    hidden boolean DEFAULT false NOT NULL
);


--
-- Name: conventions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.conventions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: conventions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.conventions_id_seq OWNED BY public.conventions.id;


--
-- Name: coupon_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupon_applications (
    id bigint NOT NULL,
    coupon_id bigint NOT NULL,
    order_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: coupon_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coupon_applications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coupon_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coupon_applications_id_seq OWNED BY public.coupon_applications.id;


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupons (
    id bigint NOT NULL,
    convention_id bigint NOT NULL,
    code text NOT NULL,
    provides_product_id bigint,
    fixed_amount_cents integer,
    fixed_amount_currency character varying,
    percent_discount numeric,
    usage_limit integer,
    expires_at timestamp without time zone,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coupons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coupons_id_seq OWNED BY public.coupons.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id bigint NOT NULL,
    convention_id bigint NOT NULL,
    name text,
    proposal_description text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: email_routes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_routes (
    id bigint NOT NULL,
    receiver_address text NOT NULL,
    forward_addresses text[] NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: email_routes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_routes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: email_routes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_routes_id_seq OWNED BY public.email_routes.id;


--
-- Name: event_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_categories (
    id bigint NOT NULL,
    convention_id bigint NOT NULL,
    name text NOT NULL,
    team_member_name text NOT NULL,
    scheduling_ui text NOT NULL,
    default_color text NOT NULL,
    full_color text NOT NULL,
    signed_up_color text NOT NULL,
    can_provide_tickets boolean DEFAULT false NOT NULL,
    event_form_id bigint NOT NULL,
    event_proposal_form_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    department_id bigint,
    proposal_description text
);


--
-- Name: event_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.event_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.event_categories_id_seq OWNED BY public.event_categories.id;


--
-- Name: event_proposals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_proposals (
    id bigint NOT NULL,
    convention_id bigint,
    owner_id bigint,
    event_id bigint,
    status character varying,
    title text,
    email text,
    length_seconds integer,
    description text,
    short_blurb text,
    registration_policy jsonb,
    can_play_concurrently boolean,
    additional_info jsonb,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    timeblock_preferences jsonb,
    submitted_at timestamp without time zone,
    admin_notes text,
    reminded_at timestamp without time zone,
    team_mailing_list_name text,
    event_category_id bigint NOT NULL
);


--
-- Name: event_proposals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.event_proposals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_proposals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.event_proposals_id_seq OWNED BY public.event_proposals.id;


--
-- Name: event_ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_ratings (
    id bigint NOT NULL,
    user_con_profile_id bigint NOT NULL,
    event_id bigint NOT NULL,
    rating integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: event_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.event_ratings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.event_ratings_id_seq OWNED BY public.event_ratings.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying,
    author character varying,
    email character varying,
    organization character varying,
    url text,
    length_seconds integer,
    can_play_concurrently boolean DEFAULT false NOT NULL,
    con_mail_destination character varying,
    description text,
    short_blurb text,
    updated_by_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    convention_id integer,
    owner_id integer,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    registration_policy jsonb,
    participant_communications text,
    age_restrictions_description text,
    content_warnings text,
    additional_info jsonb,
    admin_notes text,
    team_mailing_list_name text,
    private_signup_list boolean DEFAULT false NOT NULL,
    event_category_id bigint NOT NULL,
    minimum_age integer,
    title_vector tsvector
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: form_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.form_items (
    id bigint NOT NULL,
    form_section_id bigint,
    "position" integer,
    identifier text,
    item_type text,
    properties jsonb,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    admin_description text,
    default_value jsonb,
    public_description text
);


--
-- Name: form_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.form_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: form_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.form_items_id_seq OWNED BY public.form_items.id;


--
-- Name: form_response_changes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.form_response_changes (
    id bigint NOT NULL,
    user_con_profile_id bigint NOT NULL,
    field_identifier character varying NOT NULL,
    previous_value jsonb,
    new_value jsonb,
    notified_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    response_type character varying,
    response_id bigint,
    compacted boolean DEFAULT false NOT NULL
);


--
-- Name: form_response_changes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.form_response_changes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: form_response_changes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.form_response_changes_id_seq OWNED BY public.form_response_changes.id;


--
-- Name: form_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.form_sections (
    id bigint NOT NULL,
    form_id bigint,
    title text,
    "position" integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: form_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.form_sections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: form_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.form_sections_id_seq OWNED BY public.form_sections.id;


--
-- Name: forms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms (
    id bigint NOT NULL,
    title text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    convention_id bigint,
    form_type character varying NOT NULL
);


--
-- Name: forms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.forms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: forms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.forms_id_seq OWNED BY public.forms.id;


--
-- Name: maximum_event_provided_tickets_overrides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maximum_event_provided_tickets_overrides (
    id bigint NOT NULL,
    event_id bigint,
    ticket_type_id bigint,
    override_value integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: maximum_event_provided_tickets_overrides_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.maximum_event_provided_tickets_overrides_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: maximum_event_provided_tickets_overrides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.maximum_event_provided_tickets_overrides_id_seq OWNED BY public.maximum_event_provided_tickets_overrides.id;


--
-- Name: notification_destinations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_destinations (
    id bigint NOT NULL,
    source_type character varying NOT NULL,
    source_id bigint NOT NULL,
    staff_position_id bigint,
    user_con_profile_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: notification_destinations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notification_destinations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notification_destinations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notification_destinations_id_seq OWNED BY public.notification_destinations.id;


--
-- Name: notification_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_templates (
    id bigint NOT NULL,
    convention_id bigint NOT NULL,
    event_key character varying NOT NULL,
    subject text,
    body_html text,
    body_text text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    body_sms text
);


--
-- Name: notification_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notification_templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notification_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notification_templates_id_seq OWNED BY public.notification_templates.id;


--
-- Name: oauth_access_grants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.oauth_access_grants (
    id bigint NOT NULL,
    resource_owner_id integer NOT NULL,
    application_id bigint NOT NULL,
    token character varying NOT NULL,
    expires_in integer NOT NULL,
    redirect_uri text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    revoked_at timestamp without time zone,
    scopes character varying
);


--
-- Name: oauth_access_grants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.oauth_access_grants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_access_grants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.oauth_access_grants_id_seq OWNED BY public.oauth_access_grants.id;


--
-- Name: oauth_access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.oauth_access_tokens (
    id bigint NOT NULL,
    resource_owner_id integer,
    application_id bigint,
    token character varying NOT NULL,
    refresh_token character varying,
    expires_in integer,
    revoked_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    scopes character varying,
    previous_refresh_token character varying DEFAULT ''::character varying NOT NULL
);


--
-- Name: oauth_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.oauth_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.oauth_access_tokens_id_seq OWNED BY public.oauth_access_tokens.id;


--
-- Name: oauth_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.oauth_applications (
    id bigint NOT NULL,
    name character varying NOT NULL,
    uid character varying NOT NULL,
    secret character varying NOT NULL,
    redirect_uri text NOT NULL,
    scopes character varying DEFAULT ''::character varying NOT NULL,
    confidential boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: oauth_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.oauth_applications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.oauth_applications_id_seq OWNED BY public.oauth_applications.id;


--
-- Name: oauth_openid_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.oauth_openid_requests (
    id bigint NOT NULL,
    access_grant_id bigint NOT NULL,
    nonce character varying NOT NULL
);


--
-- Name: oauth_openid_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.oauth_openid_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_openid_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.oauth_openid_requests_id_seq OWNED BY public.oauth_openid_requests.id;


--
-- Name: order_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_entries (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    product_variant_id bigint,
    quantity integer,
    price_per_item_cents integer,
    price_per_item_currency character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: order_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_entries_id_seq OWNED BY public.order_entries.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    user_con_profile_id bigint NOT NULL,
    status character varying NOT NULL,
    charge_id character varying,
    payment_amount_cents integer,
    payment_amount_currency character varying,
    payment_note text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    submitted_at timestamp without time zone,
    paid_at timestamp without time zone
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: organization_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_roles (
    id bigint NOT NULL,
    organization_id bigint,
    name text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: organization_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organization_roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organization_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organization_roles_id_seq OWNED BY public.organization_roles.id;


--
-- Name: organization_roles_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_roles_users (
    organization_role_id bigint NOT NULL,
    user_id bigint NOT NULL
);


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations (
    id bigint NOT NULL,
    name text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;


--
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    name text,
    slug character varying,
    content text,
    parent_id integer,
    parent_type character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    cms_layout_id bigint,
    admin_notes text,
    invariant boolean DEFAULT false NOT NULL,
    skip_clickwrap_agreement boolean DEFAULT false NOT NULL,
    hidden_from_search boolean DEFAULT false NOT NULL
);


--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id bigint NOT NULL,
    event_category_id bigint,
    staff_position_id bigint,
    permission character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    organization_role_id bigint,
    convention_id bigint,
    cms_content_group_id bigint,
    CONSTRAINT permissions_model_exclusive_arc CHECK ((((((cms_content_group_id IS NOT NULL))::integer + ((convention_id IS NOT NULL))::integer) + ((event_category_id IS NOT NULL))::integer) = ANY (ARRAY[0, 1]))),
    CONSTRAINT permissions_role_exclusive_arc CHECK (((((staff_position_id IS NOT NULL))::integer + ((organization_role_id IS NOT NULL))::integer) = 1))
);


--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: pg_search_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pg_search_documents (
    id bigint NOT NULL,
    content text,
    convention_id bigint,
    searchable_type character varying,
    searchable_id bigint,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    content_vector tsvector,
    hidden_from_search boolean DEFAULT false NOT NULL
);


--
-- Name: pg_search_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pg_search_documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pg_search_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pg_search_documents_id_seq OWNED BY public.pg_search_documents.id;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variants (
    id bigint NOT NULL,
    product_id bigint,
    name text,
    description text,
    image character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    "position" integer,
    override_pricing_structure jsonb
);


--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_variants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    convention_id bigint,
    available boolean,
    name text,
    description text,
    image character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    payment_options jsonb,
    pricing_structure jsonb NOT NULL,
    provides_ticket_type_id bigint
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    convention_id integer,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rooms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- Name: rooms_runs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms_runs (
    room_id integer NOT NULL,
    run_id integer NOT NULL
);


--
-- Name: root_sites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.root_sites (
    id bigint NOT NULL,
    site_name text,
    root_page_id bigint,
    default_layout_id bigint
);


--
-- Name: root_sites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.root_sites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: root_sites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.root_sites_id_seq OWNED BY public.root_sites.id;


--
-- Name: runs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.runs (
    id integer NOT NULL,
    event_id integer,
    starts_at timestamp without time zone NOT NULL,
    title_suffix character varying,
    schedule_note text,
    updated_by_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: runs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.runs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: runs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.runs_id_seq OWNED BY public.runs.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    session_id character varying NOT NULL,
    data text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: signup_changes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.signup_changes (
    id bigint NOT NULL,
    signup_id bigint NOT NULL,
    run_id bigint NOT NULL,
    user_con_profile_id bigint NOT NULL,
    previous_signup_change_id bigint,
    updated_by_id bigint,
    bucket_key character varying,
    requested_bucket_key character varying,
    state character varying NOT NULL,
    counted boolean,
    action character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: signup_changes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.signup_changes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: signup_changes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.signup_changes_id_seq OWNED BY public.signup_changes.id;


--
-- Name: signup_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.signup_requests (
    id bigint NOT NULL,
    state character varying DEFAULT 'pending'::character varying NOT NULL,
    user_con_profile_id bigint NOT NULL,
    target_run_id bigint NOT NULL,
    requested_bucket_key character varying,
    replace_signup_id bigint,
    result_signup_id bigint,
    updated_by_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: signup_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.signup_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: signup_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.signup_requests_id_seq OWNED BY public.signup_requests.id;


--
-- Name: signups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.signups (
    id integer NOT NULL,
    run_id integer,
    bucket_key character varying,
    updated_by_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    user_con_profile_id integer NOT NULL,
    state character varying DEFAULT 'confirmed'::character varying NOT NULL,
    counted boolean,
    requested_bucket_key character varying
);


--
-- Name: signups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.signups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: signups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.signups_id_seq OWNED BY public.signups.id;


--
-- Name: staff_positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff_positions (
    id integer NOT NULL,
    convention_id integer,
    name text,
    email text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    visible boolean,
    cc_addresses text[] DEFAULT '{}'::text[] NOT NULL,
    email_aliases text[] DEFAULT '{}'::text[] NOT NULL
);


--
-- Name: staff_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.staff_positions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: staff_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.staff_positions_id_seq OWNED BY public.staff_positions.id;


--
-- Name: staff_positions_user_con_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff_positions_user_con_profiles (
    staff_position_id bigint NOT NULL,
    user_con_profile_id bigint NOT NULL
);


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_members (
    id integer NOT NULL,
    event_id integer,
    updated_at timestamp without time zone,
    updated_by_id integer,
    display boolean,
    show_email boolean,
    receive_con_email boolean,
    created_at timestamp without time zone,
    user_con_profile_id integer NOT NULL,
    receive_signup_email character varying DEFAULT 'no'::character varying NOT NULL
);


--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.team_members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- Name: ticket_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_types (
    id integer NOT NULL,
    convention_id integer,
    name text,
    description text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    counts_towards_convention_maximum boolean DEFAULT true NOT NULL,
    maximum_event_provided_tickets integer DEFAULT 0 NOT NULL,
    allows_event_signups boolean DEFAULT true NOT NULL
);


--
-- Name: ticket_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ticket_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ticket_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ticket_types_id_seq OWNED BY public.ticket_types.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tickets (
    id integer NOT NULL,
    user_con_profile_id integer,
    ticket_type_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    provided_by_event_id integer,
    order_entry_id bigint
);


--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tickets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- Name: user_activity_alerts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_activity_alerts (
    id bigint NOT NULL,
    convention_id bigint NOT NULL,
    user_id bigint,
    partial_name text,
    email text,
    trigger_on_user_con_profile_create boolean DEFAULT false NOT NULL,
    trigger_on_ticket_create boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: user_activity_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_activity_alerts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_activity_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_activity_alerts_id_seq OWNED BY public.user_activity_alerts.id;


--
-- Name: user_con_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_con_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    convention_id integer NOT NULL,
    registrar boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    nickname character varying,
    birth_date date,
    gender character varying,
    city character varying,
    state character varying,
    zipcode character varying,
    country character varying,
    day_phone character varying,
    evening_phone character varying,
    best_call_time character varying,
    preferred_contact character varying,
    bio text,
    show_nickname_in_bio boolean,
    address text,
    additional_info jsonb,
    receive_whos_free_emails boolean DEFAULT true NOT NULL,
    gravatar_enabled boolean DEFAULT false NOT NULL,
    ical_secret text NOT NULL,
    needs_update boolean DEFAULT false NOT NULL,
    accepted_clickwrap_agreement boolean DEFAULT false NOT NULL,
    mobile_phone character varying,
    allow_sms boolean DEFAULT true NOT NULL
);


--
-- Name: user_con_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_con_profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_con_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_con_profiles_id_seq OWNED BY public.user_con_profiles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    site_admin boolean,
    email character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    sign_in_count integer DEFAULT 0,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip character varying,
    last_sign_in_ip character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    legacy_password_md5 text,
    legacy_password_sha1 text,
    legacy_password_sha1_salt text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: ahoy_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ahoy_events ALTER COLUMN id SET DEFAULT nextval('public.ahoy_events_id_seq'::regclass);


--
-- Name: ahoy_visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ahoy_visits ALTER COLUMN id SET DEFAULT nextval('public.ahoy_visits_id_seq'::regclass);


--
-- Name: cms_content_group_associations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_content_group_associations ALTER COLUMN id SET DEFAULT nextval('public.cms_content_group_associations_id_seq'::regclass);


--
-- Name: cms_content_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_content_groups ALTER COLUMN id SET DEFAULT nextval('public.cms_content_groups_id_seq'::regclass);


--
-- Name: cms_files id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_files ALTER COLUMN id SET DEFAULT nextval('public.cms_files_id_seq'::regclass);


--
-- Name: cms_graphql_queries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_graphql_queries ALTER COLUMN id SET DEFAULT nextval('public.cms_graphql_queries_id_seq'::regclass);


--
-- Name: cms_layouts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_layouts ALTER COLUMN id SET DEFAULT nextval('public.cms_layouts_id_seq'::regclass);


--
-- Name: cms_navigation_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_navigation_items ALTER COLUMN id SET DEFAULT nextval('public.cms_navigation_items_id_seq'::regclass);


--
-- Name: cms_partials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_partials ALTER COLUMN id SET DEFAULT nextval('public.cms_partials_id_seq'::regclass);


--
-- Name: cms_variables id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_variables ALTER COLUMN id SET DEFAULT nextval('public.cms_variables_id_seq'::regclass);


--
-- Name: conventions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conventions ALTER COLUMN id SET DEFAULT nextval('public.conventions_id_seq'::regclass);


--
-- Name: coupon_applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon_applications ALTER COLUMN id SET DEFAULT nextval('public.coupon_applications_id_seq'::regclass);


--
-- Name: coupons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons ALTER COLUMN id SET DEFAULT nextval('public.coupons_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: email_routes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_routes ALTER COLUMN id SET DEFAULT nextval('public.email_routes_id_seq'::regclass);


--
-- Name: event_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_categories ALTER COLUMN id SET DEFAULT nextval('public.event_categories_id_seq'::regclass);


--
-- Name: event_proposals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_proposals ALTER COLUMN id SET DEFAULT nextval('public.event_proposals_id_seq'::regclass);


--
-- Name: event_ratings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_ratings ALTER COLUMN id SET DEFAULT nextval('public.event_ratings_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: form_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_items ALTER COLUMN id SET DEFAULT nextval('public.form_items_id_seq'::regclass);


--
-- Name: form_response_changes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_response_changes ALTER COLUMN id SET DEFAULT nextval('public.form_response_changes_id_seq'::regclass);


--
-- Name: form_sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_sections ALTER COLUMN id SET DEFAULT nextval('public.form_sections_id_seq'::regclass);


--
-- Name: forms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms ALTER COLUMN id SET DEFAULT nextval('public.forms_id_seq'::regclass);


--
-- Name: maximum_event_provided_tickets_overrides id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maximum_event_provided_tickets_overrides ALTER COLUMN id SET DEFAULT nextval('public.maximum_event_provided_tickets_overrides_id_seq'::regclass);


--
-- Name: notification_destinations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_destinations ALTER COLUMN id SET DEFAULT nextval('public.notification_destinations_id_seq'::regclass);


--
-- Name: notification_templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_templates ALTER COLUMN id SET DEFAULT nextval('public.notification_templates_id_seq'::regclass);


--
-- Name: oauth_access_grants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_access_grants ALTER COLUMN id SET DEFAULT nextval('public.oauth_access_grants_id_seq'::regclass);


--
-- Name: oauth_access_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.oauth_access_tokens_id_seq'::regclass);


--
-- Name: oauth_applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_applications ALTER COLUMN id SET DEFAULT nextval('public.oauth_applications_id_seq'::regclass);


--
-- Name: oauth_openid_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_openid_requests ALTER COLUMN id SET DEFAULT nextval('public.oauth_openid_requests_id_seq'::regclass);


--
-- Name: order_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_entries ALTER COLUMN id SET DEFAULT nextval('public.order_entries_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: organization_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_roles ALTER COLUMN id SET DEFAULT nextval('public.organization_roles_id_seq'::regclass);


--
-- Name: organizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: pg_search_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pg_search_documents ALTER COLUMN id SET DEFAULT nextval('public.pg_search_documents_id_seq'::regclass);


--
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- Name: root_sites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.root_sites ALTER COLUMN id SET DEFAULT nextval('public.root_sites_id_seq'::regclass);


--
-- Name: runs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.runs ALTER COLUMN id SET DEFAULT nextval('public.runs_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: signup_changes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_changes ALTER COLUMN id SET DEFAULT nextval('public.signup_changes_id_seq'::regclass);


--
-- Name: signup_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_requests ALTER COLUMN id SET DEFAULT nextval('public.signup_requests_id_seq'::regclass);


--
-- Name: signups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signups ALTER COLUMN id SET DEFAULT nextval('public.signups_id_seq'::regclass);


--
-- Name: staff_positions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_positions ALTER COLUMN id SET DEFAULT nextval('public.staff_positions_id_seq'::regclass);


--
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- Name: ticket_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_types ALTER COLUMN id SET DEFAULT nextval('public.ticket_types_id_seq'::regclass);


--
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- Name: user_activity_alerts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity_alerts ALTER COLUMN id SET DEFAULT nextval('public.user_activity_alerts_id_seq'::regclass);


--
-- Name: user_con_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_con_profiles ALTER COLUMN id SET DEFAULT nextval('public.user_con_profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: ahoy_events ahoy_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ahoy_events
    ADD CONSTRAINT ahoy_events_pkey PRIMARY KEY (id);


--
-- Name: ahoy_visits ahoy_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ahoy_visits
    ADD CONSTRAINT ahoy_visits_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: cms_content_group_associations cms_content_group_associations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_content_group_associations
    ADD CONSTRAINT cms_content_group_associations_pkey PRIMARY KEY (id);


--
-- Name: cms_content_groups cms_content_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_content_groups
    ADD CONSTRAINT cms_content_groups_pkey PRIMARY KEY (id);


--
-- Name: cms_files cms_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_files
    ADD CONSTRAINT cms_files_pkey PRIMARY KEY (id);


--
-- Name: cms_graphql_queries cms_graphql_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_graphql_queries
    ADD CONSTRAINT cms_graphql_queries_pkey PRIMARY KEY (id);


--
-- Name: cms_layouts cms_layouts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_layouts
    ADD CONSTRAINT cms_layouts_pkey PRIMARY KEY (id);


--
-- Name: cms_navigation_items cms_navigation_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_navigation_items
    ADD CONSTRAINT cms_navigation_items_pkey PRIMARY KEY (id);


--
-- Name: cms_partials cms_partials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_partials
    ADD CONSTRAINT cms_partials_pkey PRIMARY KEY (id);


--
-- Name: cms_variables cms_variables_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_variables
    ADD CONSTRAINT cms_variables_pkey PRIMARY KEY (id);


--
-- Name: conventions conventions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conventions
    ADD CONSTRAINT conventions_pkey PRIMARY KEY (id);


--
-- Name: coupon_applications coupon_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon_applications
    ADD CONSTRAINT coupon_applications_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: email_routes email_routes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_routes
    ADD CONSTRAINT email_routes_pkey PRIMARY KEY (id);


--
-- Name: event_categories event_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT event_categories_pkey PRIMARY KEY (id);


--
-- Name: event_proposals event_proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_proposals
    ADD CONSTRAINT event_proposals_pkey PRIMARY KEY (id);


--
-- Name: event_ratings event_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_ratings
    ADD CONSTRAINT event_ratings_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: form_items form_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_items
    ADD CONSTRAINT form_items_pkey PRIMARY KEY (id);


--
-- Name: form_response_changes form_response_changes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_response_changes
    ADD CONSTRAINT form_response_changes_pkey PRIMARY KEY (id);


--
-- Name: form_sections form_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_sections
    ADD CONSTRAINT form_sections_pkey PRIMARY KEY (id);


--
-- Name: forms forms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_pkey PRIMARY KEY (id);


--
-- Name: maximum_event_provided_tickets_overrides maximum_event_provided_tickets_overrides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maximum_event_provided_tickets_overrides
    ADD CONSTRAINT maximum_event_provided_tickets_overrides_pkey PRIMARY KEY (id);


--
-- Name: notification_destinations notification_destinations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_destinations
    ADD CONSTRAINT notification_destinations_pkey PRIMARY KEY (id);


--
-- Name: notification_templates notification_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT notification_templates_pkey PRIMARY KEY (id);


--
-- Name: oauth_access_grants oauth_access_grants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_access_grants
    ADD CONSTRAINT oauth_access_grants_pkey PRIMARY KEY (id);


--
-- Name: oauth_access_tokens oauth_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_access_tokens
    ADD CONSTRAINT oauth_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: oauth_applications oauth_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_applications
    ADD CONSTRAINT oauth_applications_pkey PRIMARY KEY (id);


--
-- Name: oauth_openid_requests oauth_openid_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_openid_requests
    ADD CONSTRAINT oauth_openid_requests_pkey PRIMARY KEY (id);


--
-- Name: order_entries order_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_entries
    ADD CONSTRAINT order_entries_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: organization_roles organization_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_roles
    ADD CONSTRAINT organization_roles_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: pg_search_documents pg_search_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pg_search_documents
    ADD CONSTRAINT pg_search_documents_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: root_sites root_sites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.root_sites
    ADD CONSTRAINT root_sites_pkey PRIMARY KEY (id);


--
-- Name: runs runs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.runs
    ADD CONSTRAINT runs_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: signup_changes signup_changes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_changes
    ADD CONSTRAINT signup_changes_pkey PRIMARY KEY (id);


--
-- Name: signup_requests signup_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_requests
    ADD CONSTRAINT signup_requests_pkey PRIMARY KEY (id);


--
-- Name: signups signups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signups
    ADD CONSTRAINT signups_pkey PRIMARY KEY (id);


--
-- Name: staff_positions staff_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_positions
    ADD CONSTRAINT staff_positions_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: ticket_types ticket_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_types
    ADD CONSTRAINT ticket_types_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: user_activity_alerts user_activity_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity_alerts
    ADD CONSTRAINT user_activity_alerts_pkey PRIMARY KEY (id);


--
-- Name: user_con_profiles user_con_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_con_profiles
    ADD CONSTRAINT user_con_profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: coupon_codes_unique_per_convention_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX coupon_codes_unique_per_convention_idx ON public.coupons USING btree (convention_id, lower(code));


--
-- Name: idx_max_event_provided_tickets_on_event_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_max_event_provided_tickets_on_event_id ON public.maximum_event_provided_tickets_overrides USING btree (event_id);


--
-- Name: idx_max_event_provided_tickets_on_ticket_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_max_event_provided_tickets_on_ticket_type_id ON public.maximum_event_provided_tickets_overrides USING btree (ticket_type_id);


--
-- Name: idx_permissions_unique_join; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_permissions_unique_join ON public.permissions USING btree (staff_position_id, permission, event_category_id);


--
-- Name: index_ahoy_events_on_name_and_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ahoy_events_on_name_and_time ON public.ahoy_events USING btree (name, "time");


--
-- Name: index_ahoy_events_on_properties; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ahoy_events_on_properties ON public.ahoy_events USING gin (properties jsonb_path_ops);


--
-- Name: index_ahoy_events_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ahoy_events_on_user_id ON public.ahoy_events USING btree (user_id);


--
-- Name: index_ahoy_events_on_visit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ahoy_events_on_visit_id ON public.ahoy_events USING btree (visit_id);


--
-- Name: index_ahoy_visits_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ahoy_visits_on_user_id ON public.ahoy_visits USING btree (user_id);


--
-- Name: index_ahoy_visits_on_visit_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_ahoy_visits_on_visit_token ON public.ahoy_visits USING btree (visit_token);


--
-- Name: index_cms_content_group_associations_on_cms_content_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cms_content_group_associations_on_cms_content_group_id ON public.cms_content_group_associations USING btree (cms_content_group_id);


--
-- Name: index_cms_content_group_associations_on_content; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cms_content_group_associations_on_content ON public.cms_content_group_associations USING btree (content_type, content_id);


--
-- Name: index_cms_content_groups_on_parent_type_and_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cms_content_groups_on_parent_type_and_parent_id ON public.cms_content_groups USING btree (parent_type, parent_id);


--
-- Name: index_cms_files_on_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cms_files_on_parent_id ON public.cms_files USING btree (parent_id);


--
-- Name: index_cms_files_on_parent_id_and_file; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_cms_files_on_parent_id_and_file ON public.cms_files USING btree (parent_id, file);


--
-- Name: index_cms_files_on_uploader_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cms_files_on_uploader_id ON public.cms_files USING btree (uploader_id);


--
-- Name: index_cms_graphql_queries_on_parent_type_and_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cms_graphql_queries_on_parent_type_and_parent_id ON public.cms_graphql_queries USING btree (parent_type, parent_id);


--
-- Name: index_cms_layouts_on_parent_type_and_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cms_layouts_on_parent_type_and_parent_id ON public.cms_layouts USING btree (parent_type, parent_id);


--
-- Name: index_cms_navigation_items_on_navigation_section_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cms_navigation_items_on_navigation_section_id ON public.cms_navigation_items USING btree (navigation_section_id);


--
-- Name: index_cms_navigation_items_on_page_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cms_navigation_items_on_page_id ON public.cms_navigation_items USING btree (page_id);


--
-- Name: index_cms_navigation_items_on_parent_type_and_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cms_navigation_items_on_parent_type_and_parent_id ON public.cms_navigation_items USING btree (parent_type, parent_id);


--
-- Name: index_cms_partials_on_parent_id_and_parent_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cms_partials_on_parent_id_and_parent_type ON public.cms_partials USING btree (parent_id, parent_type);


--
-- Name: index_cms_partials_on_parent_id_and_parent_type_and_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_cms_partials_on_parent_id_and_parent_type_and_name ON public.cms_partials USING btree (parent_id, parent_type, name);


--
-- Name: index_cms_variables_on_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cms_variables_on_parent_id ON public.cms_variables USING btree (parent_id);


--
-- Name: index_cms_variables_on_parent_id_and_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_cms_variables_on_parent_id_and_key ON public.cms_variables USING btree (parent_id, key);


--
-- Name: index_conventions_on_catch_all_staff_position_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_conventions_on_catch_all_staff_position_id ON public.conventions USING btree (catch_all_staff_position_id);


--
-- Name: index_conventions_on_default_layout_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_conventions_on_default_layout_id ON public.conventions USING btree (default_layout_id);


--
-- Name: index_conventions_on_domain; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_conventions_on_domain ON public.conventions USING btree (domain);


--
-- Name: index_conventions_on_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_conventions_on_organization_id ON public.conventions USING btree (organization_id);


--
-- Name: index_conventions_on_updated_by_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_conventions_on_updated_by_id ON public.conventions USING btree (updated_by_id);


--
-- Name: index_conventions_on_user_con_profile_form_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_conventions_on_user_con_profile_form_id ON public.conventions USING btree (user_con_profile_form_id);


--
-- Name: index_coupon_applications_on_coupon_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coupon_applications_on_coupon_id ON public.coupon_applications USING btree (coupon_id);


--
-- Name: index_coupon_applications_on_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coupon_applications_on_order_id ON public.coupon_applications USING btree (order_id);


--
-- Name: index_coupons_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coupons_on_convention_id ON public.coupons USING btree (convention_id);


--
-- Name: index_coupons_on_convention_id_and_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_coupons_on_convention_id_and_code ON public.coupons USING btree (convention_id, code);


--
-- Name: index_coupons_on_provides_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coupons_on_provides_product_id ON public.coupons USING btree (provides_product_id);


--
-- Name: index_departments_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_departments_on_convention_id ON public.departments USING btree (convention_id);


--
-- Name: index_email_routes_on_receiver_address; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_email_routes_on_receiver_address ON public.email_routes USING btree (receiver_address);


--
-- Name: index_event_categories_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_event_categories_on_convention_id ON public.event_categories USING btree (convention_id);


--
-- Name: index_event_categories_on_department_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_event_categories_on_department_id ON public.event_categories USING btree (department_id);


--
-- Name: index_event_categories_on_event_form_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_event_categories_on_event_form_id ON public.event_categories USING btree (event_form_id);


--
-- Name: index_event_categories_on_event_proposal_form_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_event_categories_on_event_proposal_form_id ON public.event_categories USING btree (event_proposal_form_id);


--
-- Name: index_event_proposals_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_event_proposals_on_convention_id ON public.event_proposals USING btree (convention_id);


--
-- Name: index_event_proposals_on_event_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_event_proposals_on_event_category_id ON public.event_proposals USING btree (event_category_id);


--
-- Name: index_event_proposals_on_event_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_event_proposals_on_event_id ON public.event_proposals USING btree (event_id);


--
-- Name: index_event_proposals_on_owner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_event_proposals_on_owner_id ON public.event_proposals USING btree (owner_id);


--
-- Name: index_event_ratings_on_event_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_event_ratings_on_event_id ON public.event_ratings USING btree (event_id);


--
-- Name: index_event_ratings_on_user_con_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_event_ratings_on_user_con_profile_id ON public.event_ratings USING btree (user_con_profile_id);


--
-- Name: index_event_ratings_on_user_con_profile_id_and_event_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_event_ratings_on_user_con_profile_id_and_event_id ON public.event_ratings USING btree (user_con_profile_id, event_id);


--
-- Name: index_events_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_events_on_convention_id ON public.events USING btree (convention_id);


--
-- Name: index_events_on_event_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_events_on_event_category_id ON public.events USING btree (event_category_id);


--
-- Name: index_events_on_owner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_events_on_owner_id ON public.events USING btree (owner_id);


--
-- Name: index_events_on_title_vector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_events_on_title_vector ON public.events USING gin (title_vector);


--
-- Name: index_events_on_updated_by_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_events_on_updated_by_id ON public.events USING btree (updated_by_id);


--
-- Name: index_form_items_on_form_section_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_form_items_on_form_section_id ON public.form_items USING btree (form_section_id);


--
-- Name: index_form_response_changes_on_compacted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_form_response_changes_on_compacted ON public.form_response_changes USING btree (compacted);


--
-- Name: index_form_response_changes_on_notified_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_form_response_changes_on_notified_at ON public.form_response_changes USING btree (notified_at);


--
-- Name: index_form_response_changes_on_response_type_and_response_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_form_response_changes_on_response_type_and_response_id ON public.form_response_changes USING btree (response_type, response_id);


--
-- Name: index_form_response_changes_on_user_con_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_form_response_changes_on_user_con_profile_id ON public.form_response_changes USING btree (user_con_profile_id);


--
-- Name: index_form_sections_on_form_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_form_sections_on_form_id ON public.form_sections USING btree (form_id);


--
-- Name: index_forms_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_forms_on_convention_id ON public.forms USING btree (convention_id);


--
-- Name: index_notification_destinations_on_source_type_and_source_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_notification_destinations_on_source_type_and_source_id ON public.notification_destinations USING btree (source_type, source_id);


--
-- Name: index_notification_destinations_on_staff_position_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_notification_destinations_on_staff_position_id ON public.notification_destinations USING btree (staff_position_id);


--
-- Name: index_notification_destinations_on_user_con_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_notification_destinations_on_user_con_profile_id ON public.notification_destinations USING btree (user_con_profile_id);


--
-- Name: index_notification_templates_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_notification_templates_on_convention_id ON public.notification_templates USING btree (convention_id);


--
-- Name: index_oauth_access_grants_on_application_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_oauth_access_grants_on_application_id ON public.oauth_access_grants USING btree (application_id);


--
-- Name: index_oauth_access_grants_on_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_oauth_access_grants_on_token ON public.oauth_access_grants USING btree (token);


--
-- Name: index_oauth_access_tokens_on_application_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_oauth_access_tokens_on_application_id ON public.oauth_access_tokens USING btree (application_id);


--
-- Name: index_oauth_access_tokens_on_refresh_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_oauth_access_tokens_on_refresh_token ON public.oauth_access_tokens USING btree (refresh_token);


--
-- Name: index_oauth_access_tokens_on_resource_owner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_oauth_access_tokens_on_resource_owner_id ON public.oauth_access_tokens USING btree (resource_owner_id);


--
-- Name: index_oauth_access_tokens_on_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_oauth_access_tokens_on_token ON public.oauth_access_tokens USING btree (token);


--
-- Name: index_oauth_applications_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_oauth_applications_on_uid ON public.oauth_applications USING btree (uid);


--
-- Name: index_oauth_openid_requests_on_access_grant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_oauth_openid_requests_on_access_grant_id ON public.oauth_openid_requests USING btree (access_grant_id);


--
-- Name: index_order_entries_on_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_order_entries_on_order_id ON public.order_entries USING btree (order_id);


--
-- Name: index_order_entries_on_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_order_entries_on_product_id ON public.order_entries USING btree (product_id);


--
-- Name: index_order_entries_on_product_variant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_order_entries_on_product_variant_id ON public.order_entries USING btree (product_variant_id);


--
-- Name: index_orders_on_user_con_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_orders_on_user_con_profile_id ON public.orders USING btree (user_con_profile_id);


--
-- Name: index_organization_roles_on_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_organization_roles_on_organization_id ON public.organization_roles USING btree (organization_id);


--
-- Name: index_pages_on_cms_layout_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pages_on_cms_layout_id ON public.pages USING btree (cms_layout_id);


--
-- Name: index_pages_on_parent_type_and_parent_id_and_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_pages_on_parent_type_and_parent_id_and_slug ON public.pages USING btree (parent_type, parent_id, slug);


--
-- Name: index_permissions_on_cms_content_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_permissions_on_cms_content_group_id ON public.permissions USING btree (cms_content_group_id);


--
-- Name: index_permissions_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_permissions_on_convention_id ON public.permissions USING btree (convention_id);


--
-- Name: index_permissions_on_event_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_permissions_on_event_category_id ON public.permissions USING btree (event_category_id);


--
-- Name: index_permissions_on_organization_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_permissions_on_organization_role_id ON public.permissions USING btree (organization_role_id);


--
-- Name: index_permissions_on_staff_position_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_permissions_on_staff_position_id ON public.permissions USING btree (staff_position_id);


--
-- Name: index_pg_search_documents_on_content_vector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pg_search_documents_on_content_vector ON public.pg_search_documents USING gin (content_vector);


--
-- Name: index_pg_search_documents_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pg_search_documents_on_convention_id ON public.pg_search_documents USING btree (convention_id);


--
-- Name: index_pg_search_documents_on_hidden_from_search; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pg_search_documents_on_hidden_from_search ON public.pg_search_documents USING btree (hidden_from_search);


--
-- Name: index_pg_search_documents_on_searchable_type_and_searchable_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pg_search_documents_on_searchable_type_and_searchable_id ON public.pg_search_documents USING btree (searchable_type, searchable_id);


--
-- Name: index_product_variants_on_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_product_variants_on_product_id ON public.product_variants USING btree (product_id);


--
-- Name: index_products_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_products_on_convention_id ON public.products USING btree (convention_id);


--
-- Name: index_products_on_provides_ticket_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_products_on_provides_ticket_type_id ON public.products USING btree (provides_ticket_type_id);


--
-- Name: index_rooms_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rooms_on_convention_id ON public.rooms USING btree (convention_id);


--
-- Name: index_rooms_runs_on_room_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rooms_runs_on_room_id ON public.rooms_runs USING btree (room_id);


--
-- Name: index_rooms_runs_on_run_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rooms_runs_on_run_id ON public.rooms_runs USING btree (run_id);


--
-- Name: index_rooms_runs_on_run_id_and_room_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_rooms_runs_on_run_id_and_room_id ON public.rooms_runs USING btree (run_id, room_id);


--
-- Name: index_root_sites_on_default_layout_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_root_sites_on_default_layout_id ON public.root_sites USING btree (default_layout_id);


--
-- Name: index_root_sites_on_root_page_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_root_sites_on_root_page_id ON public.root_sites USING btree (root_page_id);


--
-- Name: index_runs_on_event_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_runs_on_event_id ON public.runs USING btree (event_id);


--
-- Name: index_runs_on_updated_by_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_runs_on_updated_by_id ON public.runs USING btree (updated_by_id);


--
-- Name: index_sessions_on_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_sessions_on_session_id ON public.sessions USING btree (session_id);


--
-- Name: index_sessions_on_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sessions_on_updated_at ON public.sessions USING btree (updated_at);


--
-- Name: index_signup_changes_on_previous_signup_change_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signup_changes_on_previous_signup_change_id ON public.signup_changes USING btree (previous_signup_change_id);


--
-- Name: index_signup_changes_on_run_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signup_changes_on_run_id ON public.signup_changes USING btree (run_id);


--
-- Name: index_signup_changes_on_signup_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signup_changes_on_signup_id ON public.signup_changes USING btree (signup_id);


--
-- Name: index_signup_changes_on_updated_by_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signup_changes_on_updated_by_id ON public.signup_changes USING btree (updated_by_id);


--
-- Name: index_signup_changes_on_user_con_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signup_changes_on_user_con_profile_id ON public.signup_changes USING btree (user_con_profile_id);


--
-- Name: index_signup_requests_on_replace_signup_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signup_requests_on_replace_signup_id ON public.signup_requests USING btree (replace_signup_id);


--
-- Name: index_signup_requests_on_result_signup_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signup_requests_on_result_signup_id ON public.signup_requests USING btree (result_signup_id);


--
-- Name: index_signup_requests_on_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signup_requests_on_state ON public.signup_requests USING btree (state);


--
-- Name: index_signup_requests_on_target_run_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signup_requests_on_target_run_id ON public.signup_requests USING btree (target_run_id);


--
-- Name: index_signup_requests_on_updated_by_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signup_requests_on_updated_by_id ON public.signup_requests USING btree (updated_by_id);


--
-- Name: index_signup_requests_on_user_con_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signup_requests_on_user_con_profile_id ON public.signup_requests USING btree (user_con_profile_id);


--
-- Name: index_signups_on_run_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signups_on_run_id ON public.signups USING btree (run_id);


--
-- Name: index_signups_on_updated_by_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signups_on_updated_by_id ON public.signups USING btree (updated_by_id);


--
-- Name: index_signups_on_user_con_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signups_on_user_con_profile_id ON public.signups USING btree (user_con_profile_id);


--
-- Name: index_staff_positions_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_staff_positions_on_convention_id ON public.staff_positions USING btree (convention_id);


--
-- Name: index_staff_positions_on_visible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_staff_positions_on_visible ON public.staff_positions USING btree (visible);


--
-- Name: index_team_members_on_user_con_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_team_members_on_user_con_profile_id ON public.team_members USING btree (user_con_profile_id);


--
-- Name: index_ticket_types_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ticket_types_on_convention_id ON public.ticket_types USING btree (convention_id);


--
-- Name: index_tickets_on_order_entry_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_tickets_on_order_entry_id ON public.tickets USING btree (order_entry_id);


--
-- Name: index_tickets_on_provided_by_event_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_tickets_on_provided_by_event_id ON public.tickets USING btree (provided_by_event_id);


--
-- Name: index_tickets_on_ticket_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_tickets_on_ticket_type_id ON public.tickets USING btree (ticket_type_id);


--
-- Name: index_tickets_on_user_con_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_tickets_on_user_con_profile_id ON public.tickets USING btree (user_con_profile_id);


--
-- Name: index_user_activity_alerts_on_convention_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_activity_alerts_on_convention_id ON public.user_activity_alerts USING btree (convention_id);


--
-- Name: index_user_activity_alerts_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_activity_alerts_on_user_id ON public.user_activity_alerts USING btree (user_id);


--
-- Name: index_user_con_profiles_on_convention_id_and_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_user_con_profiles_on_convention_id_and_user_id ON public.user_con_profiles USING btree (convention_id, user_id);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_email ON public.users USING btree (email);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON public.users USING btree (reset_password_token);


--
-- Name: events tsvector_update_event_title; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tsvector_update_event_title BEFORE INSERT OR UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger('title_vector', 'public.simple_unaccent', 'title');


--
-- Name: pg_search_documents tsvector_update_pg_search_documents_content; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tsvector_update_pg_search_documents_content BEFORE INSERT OR UPDATE ON public.pg_search_documents FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger('content_vector', 'public.english_unaccent', 'content');


--
-- Name: signup_requests fk_rails_008590ab32; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_requests
    ADD CONSTRAINT fk_rails_008590ab32 FOREIGN KEY (replace_signup_id) REFERENCES public.signups(id);


--
-- Name: events fk_rails_0215031867; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_rails_0215031867 FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: runs fk_rails_058061fb50; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.runs
    ADD CONSTRAINT fk_rails_058061fb50 FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: coupon_applications fk_rails_090dd3a726; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon_applications
    ADD CONSTRAINT fk_rails_090dd3a726 FOREIGN KEY (coupon_id) REFERENCES public.coupons(id);


--
-- Name: pages fk_rails_0bbdd8c678; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT fk_rails_0bbdd8c678 FOREIGN KEY (cms_layout_id) REFERENCES public.cms_layouts(id);


--
-- Name: conventions fk_rails_12ecfb12f1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conventions
    ADD CONSTRAINT fk_rails_12ecfb12f1 FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: signup_requests fk_rails_1381757389; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_requests
    ADD CONSTRAINT fk_rails_1381757389 FOREIGN KEY (user_con_profile_id) REFERENCES public.user_con_profiles(id);


--
-- Name: permissions fk_rails_1c6be1bb15; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT fk_rails_1c6be1bb15 FOREIGN KEY (event_category_id) REFERENCES public.event_categories(id);


--
-- Name: permissions fk_rails_1dd9fc9231; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT fk_rails_1dd9fc9231 FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: organization_roles fk_rails_1edd21f138; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_roles
    ADD CONSTRAINT fk_rails_1edd21f138 FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: root_sites fk_rails_2435d7a881; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.root_sites
    ADD CONSTRAINT fk_rails_2435d7a881 FOREIGN KEY (root_page_id) REFERENCES public.pages(id);


--
-- Name: departments fk_rails_2512c2101d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT fk_rails_2512c2101d FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: conventions fk_rails_253741ce10; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conventions
    ADD CONSTRAINT fk_rails_253741ce10 FOREIGN KEY (root_page_id) REFERENCES public.pages(id);


--
-- Name: events fk_rails_2e7e36b62c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_rails_2e7e36b62c FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: user_activity_alerts fk_rails_2fb619f03b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity_alerts
    ADD CONSTRAINT fk_rails_2fb619f03b FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: form_sections fk_rails_364c041eca; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_sections
    ADD CONSTRAINT fk_rails_364c041eca FOREIGN KEY (form_id) REFERENCES public.forms(id);


--
-- Name: event_categories fk_rails_3b52f7da22; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT fk_rails_3b52f7da22 FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: signup_requests fk_rails_4018e13a21; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_requests
    ADD CONSTRAINT fk_rails_4018e13a21 FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: order_entries fk_rails_415fc5349e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_entries
    ADD CONSTRAINT fk_rails_415fc5349e FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- Name: signup_changes fk_rails_43b5611a7a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_changes
    ADD CONSTRAINT fk_rails_43b5611a7a FOREIGN KEY (signup_id) REFERENCES public.signups(id);


--
-- Name: conventions fk_rails_43f145c8c7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conventions
    ADD CONSTRAINT fk_rails_43f145c8c7 FOREIGN KEY (user_con_profile_form_id) REFERENCES public.forms(id);


--
-- Name: permissions fk_rails_47812e3d12; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT fk_rails_47812e3d12 FOREIGN KEY (staff_position_id) REFERENCES public.staff_positions(id);


--
-- Name: signups fk_rails_4abc90d735; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signups
    ADD CONSTRAINT fk_rails_4abc90d735 FOREIGN KEY (run_id) REFERENCES public.runs(id);


--
-- Name: signup_requests fk_rails_4d7ce061ee; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_requests
    ADD CONSTRAINT fk_rails_4d7ce061ee FOREIGN KEY (target_run_id) REFERENCES public.runs(id);


--
-- Name: cms_content_group_associations fk_rails_4facd81f7c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_content_group_associations
    ADD CONSTRAINT fk_rails_4facd81f7c FOREIGN KEY (cms_content_group_id) REFERENCES public.cms_content_groups(id);


--
-- Name: root_sites fk_rails_5cb3c6880e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.root_sites
    ADD CONSTRAINT fk_rails_5cb3c6880e FOREIGN KEY (default_layout_id) REFERENCES public.cms_layouts(id);


--
-- Name: cms_navigation_items fk_rails_6287617e27; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_navigation_items
    ADD CONSTRAINT fk_rails_6287617e27 FOREIGN KEY (navigation_section_id) REFERENCES public.cms_navigation_items(id);


--
-- Name: cms_files fk_rails_6ddf636ea5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_files
    ADD CONSTRAINT fk_rails_6ddf636ea5 FOREIGN KEY (uploader_id) REFERENCES public.users(id);


--
-- Name: signups fk_rails_6f474f10dd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signups
    ADD CONSTRAINT fk_rails_6f474f10dd FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: oauth_access_tokens fk_rails_732cb83ab7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_access_tokens
    ADD CONSTRAINT fk_rails_732cb83ab7 FOREIGN KEY (application_id) REFERENCES public.oauth_applications(id);


--
-- Name: oauth_openid_requests fk_rails_77114b3b09; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_openid_requests
    ADD CONSTRAINT fk_rails_77114b3b09 FOREIGN KEY (access_grant_id) REFERENCES public.oauth_access_grants(id);


--
-- Name: order_entries fk_rails_7789d2d248; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_entries
    ADD CONSTRAINT fk_rails_7789d2d248 FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: signups fk_rails_797f99efdb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signups
    ADD CONSTRAINT fk_rails_797f99efdb FOREIGN KEY (user_con_profile_id) REFERENCES public.user_con_profiles(id);


--
-- Name: signup_changes fk_rails_79e46f1342; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_changes
    ADD CONSTRAINT fk_rails_79e46f1342 FOREIGN KEY (user_con_profile_id) REFERENCES public.user_con_profiles(id);


--
-- Name: event_categories fk_rails_832c947bed; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT fk_rails_832c947bed FOREIGN KEY (event_form_id) REFERENCES public.forms(id);


--
-- Name: event_categories fk_rails_867e77c5c3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT fk_rails_867e77c5c3 FOREIGN KEY (event_proposal_form_id) REFERENCES public.forms(id);


--
-- Name: maximum_event_provided_tickets_overrides fk_rails_889a5603de; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maximum_event_provided_tickets_overrides
    ADD CONSTRAINT fk_rails_889a5603de FOREIGN KEY (ticket_type_id) REFERENCES public.ticket_types(id);


--
-- Name: event_proposals fk_rails_89019bf78d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_proposals
    ADD CONSTRAINT fk_rails_89019bf78d FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: tickets fk_rails_89217f3a4e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT fk_rails_89217f3a4e FOREIGN KEY (ticket_type_id) REFERENCES public.ticket_types(id);


--
-- Name: coupons fk_rails_8ebaf85448; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT fk_rails_8ebaf85448 FOREIGN KEY (provides_product_id) REFERENCES public.products(id);


--
-- Name: orders fk_rails_8f422d0898; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_rails_8f422d0898 FOREIGN KEY (user_con_profile_id) REFERENCES public.user_con_profiles(id);


--
-- Name: order_entries fk_rails_8fea6b4169; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_entries
    ADD CONSTRAINT fk_rails_8fea6b4169 FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: team_members fk_rails_91b80ad054; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT fk_rails_91b80ad054 FOREIGN KEY (user_con_profile_id) REFERENCES public.user_con_profiles(id);


--
-- Name: cms_navigation_items fk_rails_92d572d3d8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_navigation_items
    ADD CONSTRAINT fk_rails_92d572d3d8 FOREIGN KEY (page_id) REFERENCES public.pages(id);


--
-- Name: notification_templates fk_rails_946c790439; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT fk_rails_946c790439 FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: coupon_applications fk_rails_9478621569; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon_applications
    ADD CONSTRAINT fk_rails_9478621569 FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: event_proposals fk_rails_94d428b316; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_proposals
    ADD CONSTRAINT fk_rails_94d428b316 FOREIGN KEY (event_category_id) REFERENCES public.event_categories(id);


--
-- Name: forms fk_rails_96a0e4a52f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT fk_rails_96a0e4a52f FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: events fk_rails_a0b385fce3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_rails_a0b385fce3 FOREIGN KEY (event_category_id) REFERENCES public.event_categories(id);


--
-- Name: user_activity_alerts fk_rails_a341e92133; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity_alerts
    ADD CONSTRAINT fk_rails_a341e92133 FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: user_con_profiles fk_rails_a42fa405fd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_con_profiles
    ADD CONSTRAINT fk_rails_a42fa405fd FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: signup_changes fk_rails_a4964a0bf5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_changes
    ADD CONSTRAINT fk_rails_a4964a0bf5 FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: maximum_event_provided_tickets_overrides fk_rails_ab5f88b28a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maximum_event_provided_tickets_overrides
    ADD CONSTRAINT fk_rails_ab5f88b28a FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: rooms_runs fk_rails_abc40e1f4b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms_runs
    ADD CONSTRAINT fk_rails_abc40e1f4b FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- Name: coupons fk_rails_aec5bfc3d1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT fk_rails_aec5bfc3d1 FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: tickets fk_rails_af73cf8952; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT fk_rails_af73cf8952 FOREIGN KEY (provided_by_event_id) REFERENCES public.events(id);


--
-- Name: rooms_runs fk_rails_b1132f8445; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms_runs
    ADD CONSTRAINT fk_rails_b1132f8445 FOREIGN KEY (run_id) REFERENCES public.runs(id);


--
-- Name: staff_positions fk_rails_b388ecf670; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_positions
    ADD CONSTRAINT fk_rails_b388ecf670 FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: event_proposals fk_rails_b3b51be8c8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_proposals
    ADD CONSTRAINT fk_rails_b3b51be8c8 FOREIGN KEY (owner_id) REFERENCES public.user_con_profiles(id);


--
-- Name: signup_changes fk_rails_b4441b36fa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_changes
    ADD CONSTRAINT fk_rails_b4441b36fa FOREIGN KEY (previous_signup_change_id) REFERENCES public.signup_changes(id);


--
-- Name: oauth_access_grants fk_rails_b4b53e07b8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_access_grants
    ADD CONSTRAINT fk_rails_b4b53e07b8 FOREIGN KEY (application_id) REFERENCES public.oauth_applications(id);


--
-- Name: conventions fk_rails_b74d51e308; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conventions
    ADD CONSTRAINT fk_rails_b74d51e308 FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: notification_destinations fk_rails_b7ce40761b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_destinations
    ADD CONSTRAINT fk_rails_b7ce40761b FOREIGN KEY (staff_position_id) REFERENCES public.staff_positions(id);


--
-- Name: conventions fk_rails_ba7dd15da0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conventions
    ADD CONSTRAINT fk_rails_ba7dd15da0 FOREIGN KEY (catch_all_staff_position_id) REFERENCES public.staff_positions(id);


--
-- Name: event_categories fk_rails_c3b33a1b7c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT fk_rails_c3b33a1b7c FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: permissions fk_rails_c526e10020; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT fk_rails_c526e10020 FOREIGN KEY (cms_content_group_id) REFERENCES public.cms_content_groups(id);


--
-- Name: form_items fk_rails_ccec6a4891; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_items
    ADD CONSTRAINT fk_rails_ccec6a4891 FOREIGN KEY (form_section_id) REFERENCES public.form_sections(id);


--
-- Name: conventions fk_rails_d37c5f984d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conventions
    ADD CONSTRAINT fk_rails_d37c5f984d FOREIGN KEY (default_layout_id) REFERENCES public.cms_layouts(id);


--
-- Name: signup_changes fk_rails_d3af869d4f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_changes
    ADD CONSTRAINT fk_rails_d3af869d4f FOREIGN KEY (run_id) REFERENCES public.runs(id);


--
-- Name: products fk_rails_d7453c5d85; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_rails_d7453c5d85 FOREIGN KEY (provides_ticket_type_id) REFERENCES public.ticket_types(id);


--
-- Name: rooms fk_rails_d7f8465d1c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT fk_rails_d7f8465d1c FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: team_members fk_rails_da66de2915; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT fk_rails_da66de2915 FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: product_variants fk_rails_dae52f850b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT fk_rails_dae52f850b FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products fk_rails_e4e774d01f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_rails_e4e774d01f FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: permissions fk_rails_ef14717c62; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT fk_rails_ef14717c62 FOREIGN KEY (organization_role_id) REFERENCES public.organization_roles(id);


--
-- Name: signup_requests fk_rails_efbea103cd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signup_requests
    ADD CONSTRAINT fk_rails_efbea103cd FOREIGN KEY (result_signup_id) REFERENCES public.signups(id);


--
-- Name: tickets fk_rails_f029f4cf01; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT fk_rails_f029f4cf01 FOREIGN KEY (order_entry_id) REFERENCES public.order_entries(id);


--
-- Name: ticket_types fk_rails_f0519904ee; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_types
    ADD CONSTRAINT fk_rails_f0519904ee FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: form_response_changes fk_rails_f24e19a90a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_response_changes
    ADD CONSTRAINT fk_rails_f24e19a90a FOREIGN KEY (user_con_profile_id) REFERENCES public.user_con_profiles(id);


--
-- Name: event_proposals fk_rails_f55d8601dc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_proposals
    ADD CONSTRAINT fk_rails_f55d8601dc FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- Name: events fk_rails_f58490957c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_rails_f58490957c FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: runs fk_rails_f5bbfb45de; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.runs
    ADD CONSTRAINT fk_rails_f5bbfb45de FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: notification_destinations fk_rails_f6d69543fb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_destinations
    ADD CONSTRAINT fk_rails_f6d69543fb FOREIGN KEY (user_con_profile_id) REFERENCES public.user_con_profiles(id);


--
-- Name: tickets fk_rails_f70289817e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT fk_rails_f70289817e FOREIGN KEY (user_con_profile_id) REFERENCES public.user_con_profiles(id);


--
-- Name: user_con_profiles fk_rails_f7ac429ed7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_con_profiles
    ADD CONSTRAINT fk_rails_f7ac429ed7 FOREIGN KEY (convention_id) REFERENCES public.conventions(id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20120604131744'),
('20120604142637'),
('20120604143822'),
('20120604200523'),
('20120604201100'),
('20120609181638'),
('20120616163017'),
('20120616164203'),
('20120616165151'),
('20120616165745'),
('20120618132100'),
('20120727205929'),
('20131023143926'),
('20131227011316'),
('20140112205637'),
('20151003133150'),
('20151031144823'),
('20151107232925'),
('20151108010959'),
('20151108011241'),
('20151108020322'),
('20151108021933'),
('20151108041735'),
('20151108133732'),
('20151115201840'),
('20151116213829'),
('20151129142816'),
('20151129154850'),
('20160207182454'),
('20160207184126'),
('20160207190435'),
('20160310141909'),
('20160506223047'),
('20161112151816'),
('20161112202920'),
('20161112203319'),
('20161113163044'),
('20161127205353'),
('20170208234244'),
('20170219064321'),
('20170225162643'),
('20170521170228'),
('20170521222419'),
('20170522175455'),
('20170526163733'),
('20170602200806'),
('20170717141614'),
('20170721234402'),
('20170721234424'),
('20170721234716'),
('20170721235511'),
('20170724165907'),
('20170724172123'),
('20170829191902'),
('20170829204511'),
('20171014183340'),
('20171014184727'),
('20171014184903'),
('20171015182922'),
('20171018213324'),
('20171021154612'),
('20171029163258'),
('20171029163343'),
('20171031202206'),
('20171111160337'),
('20171111160745'),
('20171111161320'),
('20171111234858'),
('20171112175130'),
('20171112181739'),
('20171127182439'),
('20171201155843'),
('20180122194924'),
('20180123225046'),
('20180123225540'),
('20180130040510'),
('20180201184633'),
('20180204164156'),
('20180204164355'),
('20180207173614'),
('20180209001048'),
('20180209005856'),
('20180209153345'),
('20180209193547'),
('20180212193535'),
('20180213195724'),
('20180216202555'),
('20180220182000'),
('20180301162045'),
('20180304162934'),
('20180305002945'),
('20180305003044'),
('20180305014004'),
('20180305014112'),
('20180312150839'),
('20180403214703'),
('20180408151722'),
('20180502160657'),
('20180817153813'),
('20180820151612'),
('20180826212515'),
('20180922185941'),
('20180922221147'),
('20181010144914'),
('20181011174128'),
('20181011174357'),
('20181015020539'),
('20181015021731'),
('20181020012444'),
('20181024143839'),
('20181025162756'),
('20181028182940'),
('20181103145535'),
('20181103150022'),
('20181103160827'),
('20181108151904'),
('20181113145849'),
('20181209164557'),
('20181216163057'),
('20181217185216'),
('20181217193826'),
('20181221201405'),
('20181222160432'),
('20181227173933'),
('20190116034950'),
('20190126155504'),
('20190127185603'),
('20190127190135'),
('20190127192813'),
('20190208214318'),
('20190209164632'),
('20190209164652'),
('20190209164910'),
('20190209165002'),
('20190209165241'),
('20190415164817'),
('20190419202156'),
('20190420154557'),
('20190422211940'),
('20190502202300'),
('20190521212001'),
('20190601161948'),
('20190605014656'),
('20190622195919'),
('20190711173547'),
('20190714174248'),
('20190814120605'),
('20190815181731'),
('20190820154537'),
('20190821000035'),
('20190821144208'),
('20190821170923'),
('20190824154605'),
('20190824155151'),
('20190921202956'),
('20190921230626'),
('20190923155934'),
('20191001204405'),
('20191002003757'),
('20191004200432'),
('20191010195351'),
('20191019225829'),
('20191116152343'),
('20191116152842'),
('20191130174830'),
('20191205195033'),
('20191215175849'),
('20191226202814'),
('20200121165316'),
('20200124155649'),
('20200125150313'),
('20200128164623'),
('20200128165352'),
('20200128165503'),
('20200216221143'),
('20200216222452'),
('20200216222934'),
('20200217182622'),
('20200218010110'),
('20200309152308'),
('20200309160404'),
('20200309201446'),
('20200312181248'),
('20200313042743'),
('20200313212415'),
('20200314164542'),
('20200322234518'),
('20200324163822'),
('20200328204324'),
('20200328214143'),
('20200408160310'),
('20200411155258'),
('20200411161111'),
('20200422160237'),
('20200515153931'),
('20200516164805'),
('20200517155823'),
('20200601160341'),
('20200626154532');


