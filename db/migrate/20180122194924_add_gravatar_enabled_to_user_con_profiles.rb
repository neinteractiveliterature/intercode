class AddGravatarEnabledToUserConProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :user_con_profiles, :gravatar_enabled, :boolean, null: false, default: false
  end
end
