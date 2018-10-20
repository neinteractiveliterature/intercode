class AddIcalSecretToUserConProfiles < ActiveRecord::Migration[5.2]
  def up
    add_column :user_con_profiles, :ical_secret, :text, index: { unique: true }

    say 'Generating iCal secrets, this might take a while...'
    UserConProfile.find_each do |user_con_profile|
      user_con_profile.send(:generate_ical_secret)
      user_con_profile.save!
    end

    change_column :user_con_profiles, :ical_secret, :text, index: { unique: true }, null: false
  end

  def down
    remove_column :user_con_profiles, :ical_secret
  end
end
