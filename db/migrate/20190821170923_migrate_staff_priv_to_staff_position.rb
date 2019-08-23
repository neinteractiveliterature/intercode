class MigrateStaffPrivToStaffPosition < ActiveRecord::Migration[5.2]
  def up
    Convention.find_each do |convention|
      staff_profiles = convention.user_con_profiles.where(staff: true)
      if staff_profiles.none?
        say "No staff profiles for #{convention.name}; skipping"
        next
      end

      say "Migrating staff profiles for #{convention.name}"
      user_con_profile_ids = staff_profiles.pluck(:id)
      staff_position = convention.staff_positions.find do |existing_position|
        existing_position.user_con_profile_ids.sort == user_con_profile_ids.sort
      end
      staff_position ||= convention.staff_positions.create!(
        name: 'Convention Admin', visible: false, user_con_profile_ids: staff_profiles.pluck(:id)
      )
      convention_permission_names.each do |permission|
        staff_position.permissions.create!(model: convention, permission: permission)
      end
    end

    remove_column :user_con_profiles, :staff, default: false, null: false
  end

  private

  def convention_permission_names
    @convention_permission_names ||= Permission.permission_names_for_model_type('Convention')
  end
end
