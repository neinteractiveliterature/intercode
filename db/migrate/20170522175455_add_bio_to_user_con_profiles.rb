class AddBioToUserConProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :user_con_profiles, :bio, :text
  end
end
