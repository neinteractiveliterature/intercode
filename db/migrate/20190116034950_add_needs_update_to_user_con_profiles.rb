class AddNeedsUpdateToUserConProfiles < ActiveRecord::Migration[5.2]
  def change
    add_column :user_con_profiles, :needs_update, :boolean, null: false, default: false
  end
end
