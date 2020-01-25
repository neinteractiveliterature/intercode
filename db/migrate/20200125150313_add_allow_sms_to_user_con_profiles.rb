class AddAllowSmsToUserConProfiles < ActiveRecord::Migration[6.0]
  def change
    add_column :user_con_profiles, :allow_sms, :boolean, null: false, default: true
  end
end
