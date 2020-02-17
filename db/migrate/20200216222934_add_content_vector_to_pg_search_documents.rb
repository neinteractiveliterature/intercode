class AddContentVectorToPgSearchDocuments < ActiveRecord::Migration[6.0]
  def change
    add_column :pg_search_documents, :content_vector, :tsvector
    add_index :pg_search_documents, :content_vector, using: 'gin'

    reversible do |dir|
      dir.up do
        execute 'CREATE TEXT SEARCH CONFIGURATION english_unaccent (COPY = english)'
        execute <<~SQL
          ALTER TEXT SEARCH CONFIGURATION english_unaccent
          ALTER MAPPING FOR hword, hword_part, word
          WITH unaccent, english_stem;
        SQL

        execute <<~SQL
          CREATE TRIGGER tsvector_update_pg_search_documents_content BEFORE INSERT OR UPDATE
          ON pg_search_documents FOR EACH ROW EXECUTE PROCEDURE
          tsvector_update_trigger(
            content_vector, 'public.english_unaccent', content
          );
        SQL

        # Force a vector update
        execute <<~SQL
          UPDATE pg_search_documents SET content = content;
        SQL
      end

      dir.down do
        execute 'DROP TRIGGER tsvector_update_pg_search_documents_content ON pg_search_documents'
        execute 'DROP TEXT SEARCH CONFIGURATION english_unaccent'
      end
    end
  end
end
