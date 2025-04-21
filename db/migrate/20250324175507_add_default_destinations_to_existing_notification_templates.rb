class AddDefaultDestinationsToExistingNotificationTemplates < ActiveRecord::Migration[8.0]
  def up
    NotificationTemplate
      .includes(:convention)
      .find_each do |template|
        say "Adding default destinations for #{template.convention.name} #{template.event_key}"
        template.create_default_destinations!
      end
  end

  def down
    NotificationDestination.where(source_type: "NotificationTemplate").delete_all
  end
end
