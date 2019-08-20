class MigrateSchedulingPrivToStaffPosition < ActiveRecord::Migration[5.2]
  def up
    Convention.find_each do |convention|
      scheduling_profiles = convention.user_con_profiles.where(scheduling: true)
      if scheduling_profiles.none?
        say "No scheduling profiles for #{convention.name}; skipping"
        next
      end

      say "Migrating scheduling profiles for #{convention.name}"
      staff_position = convention.staff_positions.create!(
        name: 'Scheduling', visible: false, user_con_profile_ids: scheduling_profiles.pluck(:id)
      )
      %w[
        access_admin_notes
        override_event_tickets
        read_event_proposals
        read_inactive_events
        read_limited_prerelease_schedule
        read_pending_event_proposals
        read_prerelease_schedule
        read_schedule_with_counts
        update_event_proposals
        update_events
        update_rooms
        update_runs
      ].each do |permission|
        staff_position.permissions.create!(model: convention, permission: permission)
      end
    end

    remove_column :user_con_profiles, :scheduling, default: false, null: false
  end
end
