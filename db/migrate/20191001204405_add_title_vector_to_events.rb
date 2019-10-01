class AddTitleVectorToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :title_vector, :tsvector
    add_index :events, :title_vector, using: 'gin'

    reversible do |dir|
      dir.up do
        execute <<~SQL
          CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
          ON events FOR EACH ROW EXECUTE PROCEDURE
          tsvector_update_trigger(
            title_vector, 'pg_catalog.english', title
          );
        SQL

        # Force a vector update
        execute <<~SQL
          UPDATE events SET title = title;
        SQL
      end

      dir.down do
        execute <<~SQL
          DROP TRIGGER tsvectorupdate ON events;
        SQL
      end
    end
  end
end
