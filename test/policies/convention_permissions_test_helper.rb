module ConventionPermissionsTestHelper
  private

  def create_user_with_permission_in_model(permission, model, convention)
    user_con_profile = create(:user_con_profile, convention: convention)
    staff_position = create(
      :staff_position,
      name: permission,
      convention: convention,
      user_con_profiles: [user_con_profile]
    )
    Permission.create!(permission: permission, model: model, role: staff_position)

    user_con_profile.user
  end

  def create_user_with_permission_in_convention(permission, convention)
    create_user_with_permission_in_model(permission, convention, convention)
  end

  def create_user_with_permission_in_event_category(permission, event_category)
    create_user_with_permission_in_model(permission, event_category, event_category.convention)
  end

  %w[
    read_event_proposals
    read_pending_event_proposals
    update_event_proposals
    update_events
    access_admin_notes
  ].each do |permission|
    define_method "create_user_with_#{permission}_in_event_category" do |event_category|
      create_user_with_permission_in_event_category(permission, event_category)
    end
  end

  %w[
    read_limited_prerelease_schedule
    read_prerelease_schedule
    read_orders
    read_reports
    read_signup_details
    read_tickets
    read_user_con_profiles
    read_user_con_profile_email
    read_user_con_profile_personal_info
    update_events
  ].each do |permission|
    define_method "create_user_with_#{permission}_in_convention" do |convention|
      create_user_with_permission_in_convention(permission, convention)
    end
  end
end
