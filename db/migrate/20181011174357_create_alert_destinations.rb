class CreateAlertDestinations < ActiveRecord::Migration[5.2]
  def change
    create_table :alert_destinations do |t|
      t.references :alert, polymorphic: true, null: false
      t.references :staff_position, foreign_key: true
      t.references :user_con_profile, foreign_key: true

      t.timestamps
    end
  end
end
