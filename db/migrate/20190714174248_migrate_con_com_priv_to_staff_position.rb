class MigrateConComPrivToStaffPosition < ActiveRecord::Migration[5.2]
  def up
    Convention.find_each do |convention|
      con_com_profiles = convention.user_con_profiles.where(con_com: true)
      if con_com_profiles.none?
        say "No con_com profiles for #{convention.name}; skipping"
        next
      end

      say "Migrating con_com profiles for #{convention.name}"
      staff_position = convention.staff_positions.create!(
        name: 'Con Com', visible: false, user_con_profile_ids: con_com_profiles.pluck(:id)
      )
      %w[
        read_orders
        read_prerelease_schedule
        read_reports
        read_schedule_with_counts
        read_signup_details
        read_tickets
        read_user_con_profiles
        read_user_con_profile_email
        read_user_con_profile_personal_info
      ].each do |permission|
        staff_position.permissions.create!(model: convention, permission: permission)
      end
    end

    remove_column :user_con_profiles, :con_com, default: false, null: false
  end
end
