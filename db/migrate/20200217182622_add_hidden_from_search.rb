class AddHiddenFromSearch < ActiveRecord::Migration[6.0]
  def change
    add_column :pg_search_documents, :hidden_from_search, :boolean, null: false, default: false
    add_column :pages, :hidden_from_search, :boolean, null: false, default: false

    add_index :pg_search_documents, :hidden_from_search
  end
end
