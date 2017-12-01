class AddReceiveWhosFreeEmailsToUserConProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :user_con_profiles, :receive_whos_free_emails, :boolean, null: false, default: true
  end
end
