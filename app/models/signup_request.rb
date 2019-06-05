class SignupRequest < ApplicationRecord
  STATES = %w[pending accepted rejected]

  belongs_to :user_con_profile
  belongs_to :target_run
  belongs_to :replace_signup
  belongs_to :updated_by

  validates :state, presence: true, inclusion: { in: STATES }
end
