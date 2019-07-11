require 'test_helper'

class PermissionPolicyTest < ActiveSupport::TestCase
  describe '#read?' do
    it 'lets site admins read any permissions' do
      organization_permission = create(:organization_permission)
      event_category_permission = create(:event_category_permission)
      user = create(:user, site_admin: true)

      assert PermissionPolicy.new(user, organization_permission).read?
      assert PermissionPolicy.new(user, event_category_permission).read?
    end

    it 'lets con staff read permissions in their con' do
      my_con_permission = create(:event_category_permission)
      user_con_profile = create(
        :staff_user_con_profile, convention: my_con_permission.staff_position.convention
      )
      other_con_permission = create(:event_category_permission)

      assert PermissionPolicy.new(user_con_profile.user, my_con_permission).read?
      refute PermissionPolicy.new(user_con_profile.user, other_con_permission).read?
    end

    it 'does not let anyone else read permissions' do
      organization_permission = create(:organization_permission)
      event_category_permission = create(:event_category_permission)
      user = create(:user)

      refute PermissionPolicy.new(user, organization_permission).read?
      refute PermissionPolicy.new(user, event_category_permission).read?
    end
  end

  describe '#manage?' do
    it 'lets site admins manage any permissions' do
      organization_permission = create(:organization_permission)
      event_category_permission = create(:event_category_permission)
      user = create(:user, site_admin: true)

      assert PermissionPolicy.new(user, organization_permission).manage?
      assert PermissionPolicy.new(user, event_category_permission).manage?
    end

    it 'lets con staff manage permissions in their con' do
      my_con_permission = create(:event_category_permission)
      user_con_profile = create(
        :staff_user_con_profile, convention: my_con_permission.staff_position.convention
      )
      other_con_permission = create(:event_category_permission)

      assert PermissionPolicy.new(user_con_profile.user, my_con_permission).manage?
      refute PermissionPolicy.new(user_con_profile.user, other_con_permission).manage?
    end

    it 'does not let anyone else manage permissions' do
      organization_permission = create(:organization_permission)
      event_category_permission = create(:event_category_permission)
      user = create(:user)

      refute PermissionPolicy.new(user, organization_permission).manage?
      refute PermissionPolicy.new(user, event_category_permission).manage?
    end
  end

  describe 'Scope' do
    it 'returns all permissions to site admins' do
      organization_permission = create(:organization_permission)
      event_category_permission = create(:event_category_permission)
      user = create(:user, site_admin: true)
      resolved_permissions = PermissionPolicy::Scope.new(user, Permission.all).resolve

      assert_equal(
        [organization_permission, event_category_permission].sort,
        resolved_permissions.sort
      )
    end

    it 'returns permissions for cons in which the user is staff' do
      my_con_permission = create(:event_category_permission)
      user_con_profile = create(
        :staff_user_con_profile, convention: my_con_permission.staff_position.convention
      )
      create(:event_category_permission) # other_con_permission
      resolved_permissions = PermissionPolicy::Scope.new(user_con_profile.user, Permission.all)
        .resolve

      assert_equal [my_con_permission], resolved_permissions.sort
    end

    it 'does not return permissions to regular users' do
      create(:organization_permission)
      create(:event_category_permission)
      user = create(:user)
      resolved_permissions = PermissionPolicy::Scope.new(user, Permission.all).resolve

      assert_equal [].sort, resolved_permissions.sort
    end
  end
end
