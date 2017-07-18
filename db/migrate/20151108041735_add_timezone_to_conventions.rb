class AddTimezoneToConventions < ActiveRecord::Migration[5.1]
  def change
    add_column :conventions, :timezone_name, :string
  end
end
