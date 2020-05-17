class AddTimezoneModeToConventions < ActiveRecord::Migration[6.0]
  def change
    add_column :conventions, :timezone_mode, :string

    up_only do
      execute %(UPDATE conventions SET timezone_mode = 'convention_local')
    end

    change_column_null :conventions, :timezone_mode, false
  end
end
