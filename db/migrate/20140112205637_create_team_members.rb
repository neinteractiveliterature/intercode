class CreateTeamMembers < ActiveRecord::Migration[5.1]
  def change
    create_table :team_members do |t|
      t.references :event
      t.references :user
      t.datetime :updated_at
      t.integer :updated_by_id
      t.boolean :display
      t.boolean :show_email
      t.boolean :receive_con_email
      t.boolean :receive_signup_email

      t.timestamps
    end
  end
end
