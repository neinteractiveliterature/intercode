module OrganizationRoleTestHelper
  private

  def create_managing_user_in_organization(organization)
    user = create(:user)
    role = organization.organization_roles.create!(name: 'Manager', users: [user])
    role.permissions.create!(permission: 'manage_organization_access')

    user
  end

  def create_reading_user_in_organization(organization)
    user = create(:user)
    role = organization.organization_roles.create!(name: 'Reader', users: [user])
    role.permissions.create!(permission: 'read_convention_users')

    user
  end

  def create_organization_with_managing_user
    organization = create(:organization)
    user = create_managing_user_in_organization(organization)

    [organization, user]
  end

  def create_organization_with_reading_user
    organization = create(:organization)
    user = create_managing_user_in_organization(organization)

    [organization, user]
  end
end
