require 'test_helper'
require_relative 'organization_role_test_helper'

class OrganizationRolePolicyTest < ActiveSupport::TestCase
  include OrganizationRoleTestHelper

  let(:organization_role) { create(:organization_role) }
  let(:organization) { organization_role.organization }

  describe '#read?' do
    it 'lets site admins read organization roles' do
      user = create(:user, site_admin: true)
      assert OrganizationRolePolicy.new(user, organization_role).read?
    end

    it 'lets users with manage_organization_access permission read' do
      user_organization, user = create_organization_with_managing_user
      role = create(:organization_role, organization: user_organization)

      assert OrganizationRolePolicy.new(user, role).read?
    end

    it 'does not let any other users read' do
      user = create(:user)
      refute OrganizationRolePolicy.new(user, organization_role).read?
    end
  end

  describe '#manage?' do
    it 'lets site admins manage organization roles' do
      user = create(:user, site_admin: true)
      assert OrganizationRolePolicy.new(user, organization_role).manage?
    end

    it 'lets users with manage_organization_access permission manage roles' do
      user_organization, user = create_organization_with_managing_user
      role = create(:organization_role, organization: user_organization)

      assert OrganizationRolePolicy.new(user, role).manage?
    end

    it 'does not let any other users manage' do
      user = create(:user)
      refute OrganizationRolePolicy.new(user, organization_role).manage?
    end
  end

  describe 'Scope' do
    let(:organizations) { create_list(:organization, 3) }
    let(:organization_roles) do
      organizations.map { |org| create(:organization_role, organization: org) }
    end

    it 'returns all organization roles for site admins' do
      user = create(:user, site_admin: true)
      resolved_roles = OrganizationRolePolicy::Scope.new(user, OrganizationRole.all).resolve

      assert_equal organization_roles.sort, resolved_roles.sort
    end

    it 'returns all organization roles for users with manage_organization_access permission' do
      user_organization, user = create_organization_with_managing_user
      # we don't need to create a role explicitly, because create_organization_with_managing_user
      # does that in order to grant the user permission
      organization_roles
      resolved_roles = OrganizationRolePolicy::Scope.new(user, OrganizationRole.all).resolve

      assert_equal user_organization.organization_roles.sort, resolved_roles.sort
    end

    it 'returns nothing for other users' do
      user = create(:user)
      organization_roles
      resolved_roles = OrganizationRolePolicy::Scope.new(user, OrganizationRole.all).resolve

      assert_equal [], resolved_roles.sort
    end
  end
end
