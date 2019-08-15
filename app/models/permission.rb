class Permission < ApplicationRecord
  include Concerns::ExclusiveArc

  exclusive_arc :role, [StaffPosition, OrganizationRole]
  exclusive_arc :model, [Convention, EventCategory]

  scope :for_user, ->(user) do
    where(
      staff_position: StaffPosition.joins(:user_con_profiles)
        .where(user_con_profiles: { user_id: user.id })
    ).or(
      where(organization_role: OrganizationRole.joins(:users).where(users: { id: user.id }))
    )
  end
end
