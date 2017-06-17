class CreateStaffPositions < ActiveRecord::Migration[5.0]
  def change
    create_table :staff_positions do |t|
      t.references :convention, foreign_key: true
      t.text :name
      t.text :email

      t.timestamps
    end

    create_join_table :staff_positions, :user_con_profiles
  end
end
