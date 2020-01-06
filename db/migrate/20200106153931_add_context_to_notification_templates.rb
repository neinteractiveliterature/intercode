class AddContextToNotificationTemplates < ActiveRecord::Migration[6.0]
  def change
    add_reference :notification_templates, :notification_context,
      polymorphic: true, null: true,
      index: { name: 'idx_notification_templates_on_notification_context' }
    add_index :notification_templates,
      [:convention_id, :event_key, :notification_context_id, :notification_context_type],
      unique: true, name: 'idx_notification_templates_unique_key'
  end
end
