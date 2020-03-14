class AddCatchAllStaffPositionAndEmailModeToConventions < ActiveRecord::Migration[6.0]
  def change
    add_reference :conventions, :catch_all_staff_position, null: true,
      foreign_key: { to_table: 'staff_positions' }
    add_column :conventions, :email_mode, :string, null: false, default: 'forward'
  end
end
