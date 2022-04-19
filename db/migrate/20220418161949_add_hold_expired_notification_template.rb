class AddHoldExpiredNotificationTemplate < ActiveRecord::Migration[7.0]
  def up
    Convention.find_each do |convention|
      say "Loading signups/hold_expired notification template for #{convention.name}"
      adapter = CmsContentStorageAdapters::NotificationTemplates.new(convention, CmsContentSet.new(name: 'base'))

      item = adapter.all_items_from_disk.find { |i| i.identifier == 'signups/hold_expired' }
      attrs = adapter.read_item_attrs(item)
      convention.notification_templates.create!(**attrs, event_key: 'signups/hold_expired')
    end
  end

  def down
    NotificationTemplate.where(event_key: 'signups/hold_expired').each(&:destroy!)
  end
end
