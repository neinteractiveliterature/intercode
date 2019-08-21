class MigrateOutreachPrivToStaffPosition < ActiveRecord::Migration[5.2]
  def change
    Convention.find_each do |convention|
      outreach_profiles = convention.user_con_profiles.where(outreach: true)
      if outreach_profiles.none?
        say "No outreach profiles for #{convention.name}; skipping"
        next
      end

      say "Migrating outreach profiles for #{convention.name}"
      user_con_profile_ids = outreach_profiles.pluck(:id)
      staff_position = convention.staff_positions.find do |existing_position|
        existing_position.user_con_profile_ids.sort == user_con_profile_ids.sort
      end
      staff_position ||= convention.staff_positions.create!(
        name: 'Outreach Coordinator', visible: false, user_con_profile_ids: outreach_profiles.pluck(:id)
      )
      %w[
        read_signup_details
      ].each do |permission|
        staff_position.permissions.create!(model: convention, permission: permission)
      end
    end

    remove_column :user_con_profiles, :outreach, default: false, null: false
  end
end
