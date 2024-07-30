# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: signup_requests
#
#  id                   :bigint           not null, primary key
#  requested_bucket_key :string
#  state                :string           default("pending"), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  replace_signup_id    :bigint
#  result_signup_id     :bigint
#  target_run_id        :bigint           not null
#  updated_by_id        :bigint
#  user_con_profile_id  :bigint           not null
#
# Indexes
#
#  index_signup_requests_on_replace_signup_id    (replace_signup_id)
#  index_signup_requests_on_result_signup_id     (result_signup_id)
#  index_signup_requests_on_state                (state)
#  index_signup_requests_on_target_run_id        (target_run_id)
#  index_signup_requests_on_updated_by_id        (updated_by_id)
#  index_signup_requests_on_user_con_profile_id  (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (replace_signup_id => signups.id)
#  fk_rails_...  (result_signup_id => signups.id)
#  fk_rails_...  (target_run_id => runs.id)
#  fk_rails_...  (updated_by_id => users.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class SignupRequest < ApplicationRecord
  belongs_to :user_con_profile
  belongs_to :target_run, class_name: "Run"
  belongs_to :replace_signup, class_name: "Signup", optional: true
  belongs_to :result_signup, class_name: "Signup", optional: true
  belongs_to :updated_by, class_name: "User", optional: true
  has_one :convention, through: :user_con_profile
  has_one :event, through: :target_run
  has_one :signup_ranked_choice, inverse_of: :result_signup_request, dependent: :nullify

  validates :state, presence: true, inclusion: { in: Types::SignupRequestStateType.values.keys }
  validate :ensure_all_fields_point_at_the_same_convention
  validates :result_signup, presence: { if: ->(signup_request) { signup_request.state == "accepted" } }

  def to_liquid
    SignupRequestDrop.new(self)
  end

  def requested_bucket
    target_run.registration_policy.bucket_with_key(requested_bucket_key)
  end

  private

  def ensure_all_fields_point_at_the_same_convention
    %i[target_run replace_signup result_signup].each do |field|
      value = public_send(field)
      next unless value && value.convention != convention

      errors.add field, "is in #{value.convention.name} but the attendee profile is in #{convention.name}"
    end
  end
end
