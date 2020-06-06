class AddLocationToConventions < ActiveRecord::Migration[6.0]
  def change
    add_column :conventions, :location, :jsonb
  end
end
