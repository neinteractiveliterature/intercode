class NotificationDestination < ApplicationRecord
  belongs_to :source, polymorphic: true
  belongs_to :staff_position, optional: true
  belongs_to :user_con_profile, optional: true

  def user_con_profiles
    if staff_position
      staff_position.user_con_profiles
    else
      [user_con_profile]
    end
  end
end
