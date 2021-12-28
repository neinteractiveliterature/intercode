module ConventionPermissionsTestHelper
  private

  def create_user_with_permissions_in_model(permissions, model, convention)
    user_con_profile = create(:user_con_profile, convention: convention)
    staff_position =
      create(
        :staff_position,
        name: permissions.sort.join(' '),
        convention: convention,
        user_con_profiles: [user_con_profile]
      )
    Permission.grant(staff_position, model, *permissions)

    user_con_profile.user
  end

  def create_user_with_permission_in_model(permission, model, convention)
    create_user_with_permissions_in_model([permission], model, convention)
  end

  def create_user_with_permission_in_convention(permission, convention)
    create_user_with_permission_in_model(permission, convention, convention)
  end

  def create_user_with_permissions_in_convention(permissions, convention)
    create_user_with_permissions_in_model(permissions, convention, convention)
  end

  def create_identity_assumer(user, convention)
    real_profile = create(:user_con_profile, convention: convention)
    AuthorizationInfo.new(user, nil, assumed_identity_from_profile: real_profile)
  end

  def create_identity_assumer_from_other_convention(user)
    other_convention = create(:convention)
    create_identity_assumer(user, other_convention)
  end

  def assert_policy_allows(policy_class, user, record, action, convention)
    action_desc = "#{action} #{record.class.name}"
    assert policy_class.new(user, record).public_send(action),
           "#{policy_class.name} should allow user to #{action_desc}, but doesn't"
    assert policy_class.new(create_identity_assumer(user, convention), record).public_send(action),
           "#{policy_class.name} should allow same-convention identity assumer to #{action_desc}, but doesn't"
    refute policy_class.new(create_identity_assumer_from_other_convention(user), record).public_send(action),
           "#{policy_class.name} should not allow cross-convention identity assumer to #{action_desc}, but does"
  end

  def create_user_with_permission_in_cms_content_group(permission, cms_content_group)
    create_user_with_permission_in_model(permission, cms_content_group, cms_content_group.parent)
  end

  def create_user_with_permissions_in_cms_content_group(permissions, cms_content_group)
    create_user_with_permissions_in_model(permissions, cms_content_group, cms_content_group.parent)
  end

  def create_user_with_permission_in_event_category(permission, event_category)
    create_user_with_permission_in_model(permission, event_category, event_category.convention)
  end

  def create_user_with_permissions_in_event_category(permissions, event_category)
    create_user_with_permissions_in_model(permissions, event_category, event_category.convention)
  end

  Permission
    .permission_names_for_model_type('CmsContentGroup')
    .each do |permission|
      define_method "create_user_with_#{permission}_in_cms_content_group" do |cms_content_group|
        create_user_with_permission_in_cms_content_group(permission, cms_content_group)
      end
    end

  Permission
    .permission_names_for_model_type('EventCategory')
    .each do |permission|
      define_method "create_user_with_#{permission}_in_event_category" do |event_category|
        create_user_with_permission_in_event_category(permission, event_category)
      end
    end

  Permission
    .permission_names_for_model_type('Convention')
    .each do |permission|
      define_method "create_user_with_#{permission}_in_convention" do |convention|
        create_user_with_permission_in_convention(permission, convention)
      end
    end
end
