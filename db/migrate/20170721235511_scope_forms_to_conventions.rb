class ScopeFormsToConventions < ActiveRecord::Migration[5.1]
  def change
    add_reference :forms, :convention, foreign_key: true
  end
end
