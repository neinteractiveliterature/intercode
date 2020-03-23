class AddCanceledToConventions < ActiveRecord::Migration[6.0]
  def change
    add_column :conventions, :canceled, :boolean, null: false, default: false
  end
end
