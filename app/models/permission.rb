class Permission < ApplicationRecord
  belongs_to :staff_position, optional: true
  belongs_to :organization_role, optional: true
  belongs_to :event_category, optional: true

  scope :for_role, ->(role) do
    case role
    when StaffPosition then where(staff_position_id: role.id)
    when OrganizationRole then where(organization_role_id: role.id)
    else raise InvalidArgument, "Permission does not support #{role.class} roles"
    end
  end

  scope :for_user, ->(user) do
    where(
      staff_position_id: StaffPosition.joins(:user_con_profiles).where(user_con_profiles: { user_id: user.id })
    ).or(
      where(organization_role: OrganizationRole.joins(:users).where(users: { id: user.id }))
    )
  end

  scope :for_model, ->(model) do
    case model
    when EventCategory then where(event_category_id: model.id)
    else raise InvalidArgument, "Permission does not support #{model.class} models"
    end
  end

  def model
    event_category
  end

  def model=(new_model)
    case new_model
    when EventCategory
      self.event_category = new_model
    else
      raise InvalidArgument, "Permission does not support #{new_model.class} models"
    end
  end

  def role
    staff_position || organization_role
  end

  def role=(new_role)
    case new_role
    when StaffPosition
      self.staff_position = new_role
    when OrganizationRole
      self.organization_role = new_role
    else
      raise InvalidArgument, "Permission does not support #{new_role.class} roles"
    end
  end
end
