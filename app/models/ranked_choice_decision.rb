# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: ranked_choice_decisions
#
#  id                            :bigint           not null, primary key
#  decision                      :text             not null
#  extra                         :jsonb
#  reason                        :text
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  after_signup_ranked_choice_id :bigint
#  signup_id                     :bigint
#  signup_ranked_choice_id       :bigint
#  signup_request_id             :bigint
#  signup_round_id               :bigint           not null
#  user_con_profile_id           :bigint
#
# Indexes
#
#  index_ranked_choice_decisions_on_after_signup_ranked_choice_id  (after_signup_ranked_choice_id)
#  index_ranked_choice_decisions_on_signup_id                      (signup_id)
#  index_ranked_choice_decisions_on_signup_ranked_choice_id        (signup_ranked_choice_id)
#  index_ranked_choice_decisions_on_signup_request_id              (signup_request_id)
#  index_ranked_choice_decisions_on_signup_round_id                (signup_round_id)
#  index_ranked_choice_decisions_on_user_con_profile_id            (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (after_signup_ranked_choice_id => signup_ranked_choices.id) ON DELETE => nullify
#  fk_rails_...  (signup_id => signups.id) ON DELETE => nullify
#  fk_rails_...  (signup_ranked_choice_id => signup_ranked_choices.id) ON DELETE => nullify
#  fk_rails_...  (signup_request_id => signup_requests.id) ON DELETE => nullify
#  fk_rails_...  (signup_round_id => signup_rounds.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class RankedChoiceDecision < ApplicationRecord
  belongs_to :user_con_profile
  belongs_to :signup_round
  belongs_to :signup_ranked_choice, optional: true
  belongs_to :after_signup_ranked_choice, class_name: "SignupRankedChoice", optional: true
  belongs_to :signup, optional: true
  belongs_to :signup_request, optional: true
  has_one :target_run, through: :signup_request
  has_one :event, through: :target_run

  DECISIONS = Types::RankedChoiceDecisionValueType.values.values.map(&:value).freeze
  REASONS = Types::RankedChoiceDecisionReasonType.values.values.map(&:value).freeze

  validates :decision, inclusion: { in: DECISIONS }
  validates :reason, inclusion: { in: REASONS, allow_nil: true }

  private

  def signup_ranked_choice_must_match_user_con_profile_if_present
    return unless signup_ranked_choice
    return if signup_ranked_choice.user_con_profile_id == user_con_profile_id

    errors.add :signup_ranked_choice, "user_con_profile_id must match ranked_choice_decision's user_con_profile_id"
  end
end
