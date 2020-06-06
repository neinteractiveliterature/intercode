class AddHiddenToConventions < ActiveRecord::Migration[6.0]
  def change
    add_column :conventions, :hidden, :boolean, null: false, default: false
  end
end
