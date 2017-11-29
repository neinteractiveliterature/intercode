class AddAdditionalInfoToUserConProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :user_con_profiles, :additional_info, :text
  end
end
