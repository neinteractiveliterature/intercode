class AddTimespanTsrangeToRuns < ActiveRecord::Migration[6.0]
  def up
    change_column_null :events, :length_seconds, false

    add_column :runs, :timespan_tsrange, :tsrange
    add_index :runs, :timespan_tsrange, using: :gist

    execute <<~SQL
      CREATE FUNCTION run_update_timespan_tsrange() RETURNS trigger AS $$
        BEGIN
          NEW.timespan_tsrange := tsrange(
            NEW.starts_at, NEW.starts_at + make_interval(secs := (SELECT length_seconds FROM events WHERE id = NEW.event_id))
          );
          RETURN NEW;
        END
      $$
      LANGUAGE 'plpgsql';
    SQL

    execute <<~SQL
      CREATE FUNCTION event_update_all_runs_timespan_tsrange() RETURNS trigger AS $$
        BEGIN
          UPDATE runs
          SET timespan_tsrange = tsrange(
            runs.starts_at, runs.starts_at + make_interval(secs := events.length_seconds),
            '[)'
          )
          FROM events
          WHERE events.id = NEW.id AND events.id = runs.event_id;
          RETURN null;
        END
      $$
      LANGUAGE 'plpgsql';
    SQL

    execute <<~SQL
      CREATE TRIGGER run_update_timespan_tsrange BEFORE INSERT OR UPDATE OF starts_at
      ON runs FOR EACH ROW EXECUTE PROCEDURE
      run_update_timespan_tsrange();
    SQL

    execute <<~SQL
      CREATE TRIGGER event_update_all_runs_timespan_tsrange AFTER INSERT OR UPDATE OF length_seconds
      ON events FOR EACH ROW EXECUTE PROCEDURE
      event_update_all_runs_timespan_tsrange();
    SQL

    # Force a trigger on all runs
    execute <<~SQL
      UPDATE runs SET starts_at = starts_at;
    SQL

    change_column_null :runs, :timespan_tsrange, false
  end

  def down
    execute <<~SQL
      DROP TRIGGER event_update_all_runs_timespan_tsrange ON events;
    SQL

    execute <<~SQL
      DROP TRIGGER run_update_timespan_tsrange ON runs;
    SQL

    execute <<~SQL
      DROP FUNCTION event_update_all_runs_timespan_tsrange;
    SQL

    execute <<~SQL
      DROP FUNCTION run_update_timespan_tsrange;
    SQL

    remove_column :runs, :timespan_tsrange
    change_column_null :events, :length_seconds, true
  end
end
