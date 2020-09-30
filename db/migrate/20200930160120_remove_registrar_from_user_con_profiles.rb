class RemoveRegistrarFromUserConProfiles < ActiveRecord::Migration[6.0]
  def change
    remove_column :user_con_profiles, :registrar, :boolean, null: false, default: false
  end
end
