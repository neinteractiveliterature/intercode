class MigrateGMLiaisonPrivToStaffPosition < ActiveRecord::Migration[5.2]
  def up
    Convention.find_each do |convention|
      gm_liaison_profiles = convention.user_con_profiles.where(gm_liaison: true)
      if gm_liaison_profiles.none?
        say "No gm_liaison profiles for #{convention.name}; skipping"
        next
      end

      say "Migrating gm_liaison profiles for #{convention.name}"
      user_con_profile_ids = gm_liaison_profiles.pluck(:id)
      staff_position = convention.staff_positions.find do |existing_position|
        existing_position.user_con_profile_ids.sort == user_con_profile_ids.sort
      end
      staff_position ||= convention.staff_positions.create!(
        name: 'GM Coordinator', visible: false, user_con_profile_ids: gm_liaison_profiles.pluck(:id)
      )
      %w[
        access_admin_notes
        override_event_tickets
        read_event_proposals
        read_inactive_events
        read_limited_prerelease_schedule
        read_prerelease_schedule
        read_schedule_with_counts
        update_event_proposals
        update_event_team_members
        update_events
        update_rooms
        update_runs
      ].each do |permission|
        staff_position.permissions.create!(model: convention, permission: permission)
      end
    end

    remove_column :user_con_profiles, :gm_liaison, default: false, null: false
  end
end
