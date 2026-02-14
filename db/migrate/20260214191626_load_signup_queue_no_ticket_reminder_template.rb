class LoadSignupQueueNoTicketReminderTemplate < ActiveRecord::Migration[7.2]
  def up
    Convention.find_each do |convention|
      say "Loading signup_queue/no_ticket_reminder notification template for #{convention.name}"
      adapter = CmsContentStorageAdapters::NotificationTemplates.new(convention, CmsContentSet.new(name: "base"))

      item = adapter.all_items_from_disk.find { |i| i.identifier == "signup_queue/no_ticket_reminder" }
      next unless item

      attrs = adapter.read_item_attrs(item)
      template = convention.notification_templates.find_or_initialize_by(event_key: "signup_queue/no_ticket_reminder")
      template.assign_attributes(**attrs)
      template.save!

      # Build default destinations if this is a new template
      if template.notification_destinations.empty?
        SignupQueue::NoTicketReminderNotifier.build_default_destinations(notification_template: template).each(&:save!)
      end
    end
  end

  def down
    NotificationTemplate.where(event_key: "signup_queue/no_ticket_reminder").find_each(&:destroy!)
  end
end
