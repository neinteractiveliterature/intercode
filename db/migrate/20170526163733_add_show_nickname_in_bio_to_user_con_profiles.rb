class AddShowNicknameInBioToUserConProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :user_con_profiles, :show_nickname_in_bio, :boolean
  end
end
