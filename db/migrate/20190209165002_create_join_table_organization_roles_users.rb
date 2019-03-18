class CreateJoinTableOrganizationRolesUsers < ActiveRecord::Migration[5.2]
  def change
    create_join_table :organization_roles, :users do |t|
      # t.index [:organization_role_id, :user_id]
      # t.index [:user_id, :organization_role_id]
    end
  end
end
