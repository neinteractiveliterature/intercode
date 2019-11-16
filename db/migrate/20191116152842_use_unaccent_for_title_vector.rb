class UseUnaccentForTitleVector < ActiveRecord::Migration[6.0]
  def change
    reversible do |dir|
      dir.up do
        execute 'CREATE TEXT SEARCH CONFIGURATION simple_unaccent (COPY = simple)'
        execute <<~SQL
          ALTER TEXT SEARCH CONFIGURATION simple_unaccent
          ALTER MAPPING FOR hword, hword_part, word
          WITH unaccent, simple;
        SQL

        execute 'DROP TRIGGER tsvector_update_event_title ON events;'
        execute <<~SQL
          CREATE TRIGGER tsvector_update_event_title BEFORE INSERT OR UPDATE
          ON events FOR EACH ROW EXECUTE PROCEDURE
          tsvector_update_trigger(
            title_vector, 'public.simple_unaccent', title
          );
        SQL
      end

      dir.down do
        execute 'DROP TRIGGER tsvector_update_event_title ON events;'
        execute <<~SQL
          CREATE TRIGGER tsvector_update_event_title BEFORE INSERT OR UPDATE
          ON events FOR EACH ROW EXECUTE PROCEDURE
          tsvector_update_trigger(
            title_vector, 'pg_catalog.simple', title
          );
        SQL
        execute 'DROP TEXT SEARCH CONFIGURATION simple_unaccent'
      end

      # Force a vector update
      execute <<~SQL
        UPDATE events SET title = title;
      SQL
    end
  end
end
