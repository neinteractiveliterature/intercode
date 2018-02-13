class AddVisibleToStaffPositions < ActiveRecord::Migration[5.1]
  def change
    add_column :staff_positions, :visible, :boolean

    reversible do |dir|
      dir.up { StaffPosition.update_all(visible: true) }
    end

    add_index :staff_positions, :visible
  end
end
