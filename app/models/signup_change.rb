class SignupChange < ApplicationRecord
  belongs_to :signup
  belongs_to :run
  belongs_to :user_con_profile
  belongs_to :previous_signup_change, class_name: 'SignupChange', required: false
  belongs_to :updated_by, class_name: 'User', required: false

  validates :action, presence: true, inclusion: { in: Types::SignupChangeActionType.values.keys }
end
