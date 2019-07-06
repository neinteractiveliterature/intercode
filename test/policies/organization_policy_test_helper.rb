module OrganizationPolicyTestHelper
  private

  def create_organization_with_managing_user
    user = create(:user)
    user_organization = create(:organization)
    role = user_organization.organization_roles.create!(name: 'Manager', users: [user])
    role.permissions.create!(permission: 'manage_organization_access')

    [user_organization, user]
  end
end
