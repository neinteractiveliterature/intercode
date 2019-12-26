class RenameAlertDestinationsToNotificationDestinations < ActiveRecord::Migration[6.0]
  def change
    rename_table :alert_destinations, :notification_destinations
    rename_column :notification_destinations, :alert_id, :source_id
    rename_column :notification_destinations, :alert_type, :source_type
  end
end
