class SwitchToSimpleVector < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        execute 'DROP TRIGGER tsvectorupdate ON events;'
        execute <<~SQL
          CREATE TRIGGER tsvector_update_event_title BEFORE INSERT OR UPDATE
          ON events FOR EACH ROW EXECUTE PROCEDURE
          tsvector_update_trigger(
            title_vector, 'pg_catalog.simple', title
          );
        SQL
      end

      dir.down do
        execute 'DROP TRIGGER tsvector_update_event_title ON events;'
        execute <<~SQL
          CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
          ON events FOR EACH ROW EXECUTE PROCEDURE
          tsvector_update_trigger(
            title_vector, 'pg_catalog.english', title
          );
        SQL
      end

      # Force a vector update
      execute <<~SQL
        UPDATE events SET title = title;
      SQL
    end
  end
end
