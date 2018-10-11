class AlertDestination < ApplicationRecord
  belongs_to :alert, polymorphic: true
  belongs_to :staff_position, optional: true
  belongs_to :user_con_profile, optional: true
end
