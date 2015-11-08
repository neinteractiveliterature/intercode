class AddTimezoneToConventions < ActiveRecord::Migration
  def change
    add_column :conventions, :timezone_name, :string
  end
end
