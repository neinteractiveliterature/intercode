class CreateNotificationTemplates < ActiveRecord::Migration[6.0]
  def change
    create_table :notification_templates do |t|
      t.references :convention, null: false, foreign_key: true
      t.string :event_key, null: false
      t.text :subject
      t.text :body_html
      t.text :body_text

      t.timestamps
    end
  end
end
