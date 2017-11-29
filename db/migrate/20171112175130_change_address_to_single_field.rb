class ChangeAddressToSingleField < ActiveRecord::Migration[5.1]
  def change
    add_column :user_con_profiles, :address, :text

    reversible do |dir|
      dir.up do
        UserConProfile.find_each do |user_con_profile|
          user_con_profile.update!(
            address: [user_con_profile.address1, user_con_profile.address2].map(&:presence).compact.join("\n")
          )
        end
      end

      dir.down do
        UserConProfile.find_each do |user_con_profile|
          address_lines = (user_con_profile.address || '').split(/\r?\n/).map(&:presence).compact
          user_con_profile.update!(
            address1: address_lines[0],
            address2: address_lines.slice(1, address_lines.size).join("\n")
          )
        end
      end
    end

    remove_column :user_con_profiles, :address1, :text
    remove_column :user_con_profiles, :address2, :text
  end
end
