class CreateScheduledValueFunctions < ActiveRecord::Migration[6.0]
  def up
    execute <<~SQL
    CREATE FUNCTION scheduled_value_timespans(scheduled_value jsonb)
      RETURNS TABLE(timespan_index bigint, start timestamp, finish timestamp, value jsonb)
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
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION scheduled_value_timespan_at(scheduled_value jsonb, target_time timestamp)
      RETURNS jsonb
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
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION next_scheduled_value_timespan_at(scheduled_value jsonb, target_time timestamp)
      RETURNS jsonb
      AS $$
        SELECT to_jsonb(timespan) FROM (
          SELECT * FROM scheduled_value_timespans(scheduled_value) timespans
          WHERE timespan_index = (scheduled_value_timespan_at(scheduled_value, target_time)->>'timespan_index')::bigint + 1
          LIMIT 1
        ) timespan
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION scheduled_value_at(scheduled_value jsonb, target_time timestamp)
      RETURNS jsonb
      AS $$
        SELECT scheduled_value_timespan_at(scheduled_value, target_time)->'value'
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION next_scheduled_value_at(scheduled_value jsonb, target_time timestamp)
      RETURNS jsonb
      AS $$
        SELECT next_scheduled_value_timespan_at(scheduled_value, target_time)->'value'
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION next_scheduled_value_change_at(scheduled_value jsonb, target_time timestamp)
      RETURNS timestamp
      AS $$
        SELECT (next_scheduled_value_timespan_at(scheduled_value, target_time)->>'start')::timestamp
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION current_scheduled_value_timespan(scheduled_value jsonb)
      RETURNS jsonb
      AS $$
        SELECT scheduled_value_timespan_at(scheduled_value, now()::timestamp)
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION next_scheduled_value_timespan(scheduled_value jsonb)
      RETURNS jsonb
      AS $$
        SELECT next_scheduled_value_timespan_at(scheduled_value, now()::timestamp)
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION current_scheduled_value(scheduled_value jsonb)
      RETURNS jsonb
      AS $$
        SELECT current_scheduled_value_timespan(scheduled_value)->'value'
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION next_scheduled_value(scheduled_value jsonb)
      RETURNS jsonb
      AS $$
        SELECT next_scheduled_value_timespan(scheduled_value)->'value'
      $$
      LANGUAGE 'sql';
    SQL

    execute <<~SQL
    CREATE FUNCTION next_scheduled_value_change(scheduled_value jsonb)
      RETURNS timestamp
      AS $$
        SELECT (next_scheduled_value_timespan(scheduled_value)->>'start')::timestamp
      $$
      LANGUAGE 'sql';
    SQL
  end

  def down
    execute 'DROP FUNCTION next_scheduled_value_change(scheduled_value jsonb)'
    execute 'DROP FUNCTION next_scheduled_value(scheduled_value jsonb)'
    execute 'DROP FUNCTION current_scheduled_value(scheduled_value jsonb)'
    execute 'DROP FUNCTION next_scheduled_value_timespan(scheduled_value jsonb)'
    execute 'DROP FUNCTION current_scheduled_value_timespan(scheduled_value jsonb)'
    execute 'DROP FUNCTION next_scheduled_value_change_at(scheduled_value jsonb, target_time timestamp)'
    execute 'DROP FUNCTION next_scheduled_value_at(scheduled_value jsonb, target_time timestamp)'
    execute 'DROP FUNCTION scheduled_value_at(scheduled_value jsonb, target_time timestamp)'
    execute 'DROP FUNCTION next_scheduled_value_timespan_at(scheduled_value jsonb, target_time timestamp)'
    execute 'DROP FUNCTION scheduled_value_timespan_at(scheduled_value jsonb, target_time timestamp)'
    execute 'DROP FUNCTION scheduled_value_timespans(scheduled_value jsonb)'
  end
end
