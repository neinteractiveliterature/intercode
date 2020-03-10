class CreateRegistrationPolicyFunctions < ActiveRecord::Migration[6.0]
  def up
    execute <<~SQL
    CREATE FUNCTION registration_policy_buckets(registration_policy jsonb)
      RETURNS TABLE(
        bucket_index bigint,
        key text,
        name text,
        description text,
        minimum_slots int,
        preferred_slots int,
        total_slots int,
        anything boolean,
        not_counted boolean,
        expose_attendees boolean
      )
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
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION bucket_keys(registration_policy jsonb) RETURNS text[]
      AS $$
        SELECT ARRAY_AGG(key) FROM registration_policy_buckets(registration_policy)
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION counted_bucket_keys(registration_policy jsonb) RETURNS text[]
      AS $$
        SELECT ARRAY_AGG(key) FROM registration_policy_buckets(registration_policy)
        WHERE not_counted = 'f'
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION not_counted_bucket_keys(registration_policy jsonb) RETURNS text[]
      AS $$
        SELECT ARRAY_AGG(key) FROM registration_policy_buckets(registration_policy)
        WHERE not_counted = 't'
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION anything_bucket_keys(registration_policy jsonb) RETURNS text[]
      AS $$
        SELECT ARRAY_AGG(key) FROM registration_policy_buckets(registration_policy)
        WHERE anything = 't'
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION registration_bucket(registration_policy jsonb, bucket_key text) RETURNS jsonb
      AS $$
        SELECT to_jsonb(bucket) FROM (
          SELECT * FROM registration_policy_buckets(registration_policy)
          WHERE key = bucket_key
          LIMIT 1
        ) bucket
      $$
      LANGUAGE 'sql';
    SQL

    %w[minimum preferred total].each do |slot_count_type|
      execute <<~SQL
      CREATE FUNCTION #{slot_count_type}_all_slots(registration_policy jsonb) RETURNS bigint
        AS $$
          SELECT COALESCE(SUM(#{slot_count_type}_slots), 0) FROM registration_policy_buckets(registration_policy)
        $$
        LANGUAGE 'sql';
      SQL

      execute <<~SQL
      CREATE FUNCTION #{slot_count_type}_counted_slots(registration_policy jsonb) RETURNS bigint
        AS $$
          SELECT COALESCE(SUM(#{slot_count_type}_slots), 0) FROM registration_policy_buckets(registration_policy)
          WHERE not_counted = 'f'
        $$
        LANGUAGE 'sql';
      SQL

      execute <<~SQL
      CREATE FUNCTION #{slot_count_type}_not_counted_slots(registration_policy jsonb) RETURNS bigint
        AS $$
          SELECT COALESCE(SUM(#{slot_count_type}_slots), 0) FROM registration_policy_buckets(registration_policy)
          WHERE not_counted = 't'
        $$
        LANGUAGE 'sql';
      SQL

      execute <<~SQL
      CREATE FUNCTION bucket_#{slot_count_type}_slots(registration_policy jsonb, bucket_key text)
        RETURNS bigint
        AS $$
          SELECT (registration_bucket(registration_policy, bucket_key)->>'#{slot_count_type}_slots')::bigint
        $$
        LANGUAGE 'sql';
      SQL
    end
  end

  def down
    %w[minimum preferred total].each do |slot_count_type|
      execute "DROP FUNCTION bucket_#{slot_count_type}_slots(registration_policy jsonb, bucket_key text)"
      %w[all counted not_counted].each do |counted_type|
        execute "DROP FUNCTION #{slot_count_type}_#{counted_type}_slots(registration_policy jsonb)"
      end
    end
    execute 'DROP FUNCTION registration_bucket(registration_policy jsonb, bucket_key text)'
    execute 'DROP FUNCTION anything_bucket_keys(registration_policy jsonb)'
    execute 'DROP FUNCTION not_counted_bucket_keys(registration_policy jsonb)'
    execute 'DROP FUNCTION counted_bucket_keys(registration_policy jsonb)'
    execute 'DROP FUNCTION bucket_keys(registration_policy jsonb)'
    execute 'DROP FUNCTION registration_policy_buckets(registration_policy jsonb)'
  end
end
