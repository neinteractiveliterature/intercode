module EventCategoryTestHelper
  private

  def create_user_with_permission_in_event_category(permission, event_category)
    user_con_profile = create(:user_con_profile, convention: event_category.convention)
    staff_position = create(
      :staff_position,
      name: permission,
      convention: event_category.convention,
      user_con_profiles: [user_con_profile]
    )
    event_category.permissions.create!(permission: permission, staff_position: staff_position)

    user_con_profile.user
  end

  %w[
    read_event_proposals
    read_pending_event_proposals
    update_event_proposals
    access_admin_notes
  ].each do |permission|
    define_method "create_user_with_#{permission}_in_event_category" do |event_category|
      create_user_with_permission_in_event_category(permission, event_category)
    end
  end
end
