class AddContentVectorToPgSearchDocuments < ActiveRecord::Migration[6.0]
  def change
    add_column :pg_search_documents, :content_vector, :tsvector
    add_index :pg_search_documents, :content_vector, using: 'gin'

    reversible do |dir|
      dir.up do
        execute <<~SQL
          CREATE TRIGGER tsvector_update_pg_search_documents_content BEFORE INSERT OR UPDATE
          ON pg_search_documents FOR EACH ROW EXECUTE PROCEDURE
          tsvector_update_trigger(
            content_vector, 'public.simple_unaccent', content
          );
        SQL
      end

      dir.down do
        execute 'DROP TRIGGER tsvector_update_pg_search_documents_content'
      end
    end

    # Force a vector update
    execute <<~SQL
      UPDATE pg_search_documents SET content = content;
    SQL
  end
end
