class CreateUserActivityAlerts < ActiveRecord::Migration[5.2]
  def change
    create_table :user_activity_alerts do |t|
      t.references :convention, foreign_key: true, null: false
      t.references :user, foreign_key: true
      t.text :partial_name
      t.text :email
      t.boolean :trigger_on_user_con_profile_create
      t.boolean :trigger_on_ticket_create

      t.timestamps
    end
  end
end
