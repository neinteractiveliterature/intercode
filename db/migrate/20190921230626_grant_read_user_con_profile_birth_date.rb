class GrantReadUserConProfileBirthDate < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        if Permission.where(permission: 'read_user_con_profile_birth_date').none?
          Permission.where(permission: 'read_user_con_profile_personal_info').find_each do |perm|
            say "Granting read_user_con_profile_birth_date to #{perm.role.class} #{perm.role.id}"
            Permission.grant(perm.role, perm.model, 'read_user_con_profile_birth_date')
          end
        end
      end
    end
  end
end
