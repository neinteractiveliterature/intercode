class AddTimezoneToConventions < ActiveRecord::Migration[4.2]
  def change
    add_column :conventions, :timezone_name, :string
  end
end
