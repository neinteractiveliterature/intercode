require 'test_helper'

class OrganizationPolicyTest < ActiveSupport::TestCase
  let(:organization) { create(:organization) }

  describe '#read?' do
    it 'lets site admins read organizations' do
      user = create(:user, site_admin: true)
      assert OrganizationPolicy.new(user, organization).read?
    end

    it 'lets users with manage_organization_access permission on _any_ organization read' do
      user_organization, user = create_organization_with_managing_user
      other_organization = create(:organization)

      assert OrganizationPolicy.new(user, user_organization).read?
      assert OrganizationPolicy.new(user, other_organization).read?
    end

    it 'does not let any other users read' do
      user = create(:user)
      refute OrganizationPolicy.new(user, organization).read?
    end
  end

  describe '#manage?' do
    it 'lets site admins manage organizations' do
      user = create(:user, site_admin: true)
      assert OrganizationPolicy.new(user, organization).manage?
    end

    it 'does not let users with manage_organization_access permission manage the org itself' do
      user_organization, user = create_organization_with_managing_user
      other_organization = create(:organization)

      refute OrganizationPolicy.new(user, user_organization).manage?
      refute OrganizationPolicy.new(user, other_organization).manage?
    end

    it 'does not let any other users manage' do
      user = create(:user)
      refute OrganizationPolicy.new(user, organization).manage?
    end
  end

  describe 'Scope' do
    let(:organizations) { create_list(:organization, 3) }

    it 'returns all orgs for site admins' do
      user = create(:user, site_admin: true)
      resolved_organizations = OrganizationPolicy::Scope.new(user, Organization.all).resolve

      assert_equal organizations.sort, resolved_organizations.sort
    end

    it 'returns all orgs for users with manage_organization_access permission on any org' do
      user_organization, user = create_organization_with_managing_user
      resolved_organizations = OrganizationPolicy::Scope.new(user, Organization.all).resolve

      assert_equal [*organizations, user_organization].sort, resolved_organizations.sort
    end

    it 'returns nothing for other users' do
      user = create(:user)
      resolved_organizations = OrganizationPolicy::Scope.new(user, Organization.all).resolve

      assert_equal [], resolved_organizations.sort
    end
  end

  private

  def create_organization_with_managing_user
    user = create(:user)
    user_organization = create(:organization)
    role = user_organization.organization_roles.create!(users: [user])
    role.permissions.create!(permission: 'manage_organization_access')

    [user_organization, user]
  end
end
