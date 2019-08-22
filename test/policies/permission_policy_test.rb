require 'test_helper'
require_relative 'convention_permissions_test_helper'

class PermissionPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  describe '#read?' do
    it 'lets site admins read any permissions' do
      organization_permission = create(:organization_permission)
      event_category_permission = create(:event_category_permission)
      user = create(:user, site_admin: true)

      assert PermissionPolicy.new(user, organization_permission).read?
      assert PermissionPolicy.new(user, event_category_permission).read?
    end

    it 'lets users with update_permissions read permissions in their con' do
      my_con_permission = create(:event_category_permission)
      convention = my_con_permission.staff_position.convention
      user = create_user_with_update_permissions_in_convention(convention)
      other_con_permission = create(:event_category_permission)

      assert PermissionPolicy.new(user, my_con_permission).read?
      refute PermissionPolicy.new(user, other_con_permission).read?
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

    it 'lets users with update_permissions manage permissions in their con' do
      my_con_permission = create(:event_category_permission)
      convention = my_con_permission.staff_position.convention
      user = create_user_with_update_permissions_in_convention(convention)
      other_con_permission = create(:event_category_permission)

      assert PermissionPolicy.new(user, my_con_permission).manage?
      refute PermissionPolicy.new(user, other_con_permission).manage?
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

    it 'returns permissions for cons in which the user has update_permissions' do
      my_con_permission = create(:event_category_permission)
      convention = my_con_permission.staff_position.convention
      user = create_user_with_update_permissions_in_convention(convention)
      user_permissions = Permission.where(
        staff_position: StaffPosition.where(
          id: UserConProfile.where(user_id: user.id).flat_map(&:staff_position_ids)
        )
      )
      create(:event_category_permission) # other_con_permission
      resolved_permissions = PermissionPolicy::Scope.new(user, Permission.all).resolve

      assert_equal [my_con_permission, *user_permissions], resolved_permissions.sort
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
