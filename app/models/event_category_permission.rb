class EventCategoryPermission < ApplicationRecord
  belongs_to :event_category
  belongs_to :staff_position

  scope :for_user, ->(user) do
    where(
      staff_position_id: StaffPosition.joins(:user_con_profiles).where(user_con_profiles: { user_id: user.id })
    )
  end
end
