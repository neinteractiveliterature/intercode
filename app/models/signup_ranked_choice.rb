# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: signup_ranked_choices
#
#  id                   :bigint           not null, primary key
#  priority             :integer          not null
#  requested_bucket_key :string           not null
#  state                :string           not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  result_signup_id     :bigint
#  target_run_id        :bigint           not null
#  updated_by_id        :bigint           not null
#  user_con_profile_id  :bigint           not null
#
# Indexes
#
#  index_signup_ranked_choices_on_result_signup_id     (result_signup_id)
#  index_signup_ranked_choices_on_target_run_id        (target_run_id)
#  index_signup_ranked_choices_on_updated_by_id        (updated_by_id)
#  index_signup_ranked_choices_on_user_con_profile_id  (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (result_signup_id => signups.id)
#  fk_rails_...  (target_run_id => runs.id)
#  fk_rails_...  (updated_by_id => users.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
class SignupRankedChoice < ApplicationRecord
  belongs_to :user_con_profile
  belongs_to :target_run, class_name: "Run"
  belongs_to :result_signup, class_name: "Signup", optional: true
  belongs_to :updated_by, class_name: "User"
  has_one :convention, through: :user_con_profile

  validates :state, presence: true, inclusion: { in: Types::SignupRankedChoiceStateType.values.keys }
  validate :ensure_all_fields_point_at_the_same_convention
  validates :result_signup, presence: { if: ->(signup_ranked_choice) { signup_ranked_choice.state == "signed_up" } }

  private

  def ensure_all_fields_point_at_the_same_convention
    %i[target_run result_signup].each do |field|
      value = public_send(field)
      next unless value && value.convention != convention

      errors.add field, "is in #{value.convention.name} but the attendee profile is in #{convention.name}"
    end
  end
end
