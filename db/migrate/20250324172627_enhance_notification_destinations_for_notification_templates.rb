class EnhanceNotificationDestinationsForNotificationTemplates < ActiveRecord::Migration[8.0]
  def change
    change_table :notification_destinations, bulk: true do |t|
      t.text :dynamic_destination
      t.jsonb :conditions
    end

    add_check_constraint :notification_destinations, <<~SQL, name: "notification_destination_type_exclusive_arc"
      (
        (user_con_profile_id IS NOT NULL)::integer +
        (staff_position_id IS NOT NULL)::integer +
        (dynamic_destination IS NOT NULL)::integer
      ) = 1
    SQL
  end
end
