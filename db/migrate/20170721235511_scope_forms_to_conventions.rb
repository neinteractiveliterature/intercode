class ScopeFormsToConventions < ActiveRecord::Migration[5.1]
  def change
    add_column :forms, :convention, :references, foreign_key: true
  end
end
