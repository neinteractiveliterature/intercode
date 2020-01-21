class AddBodySmsToNotificationTemplates < ActiveRecord::Migration[6.0]
  def change
    add_column :notification_templates, :body_sms, :text
  end
end
