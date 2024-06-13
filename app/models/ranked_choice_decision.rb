# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: ranked_choice_decisions
#
#  id                      :bigint           not null, primary key
#  decision                :text             not null
#  extra                   :jsonb
#  reason                  :text
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  signup_id               :bigint
#  signup_ranked_choice_id :bigint
#  signup_request_id       :bigint
#  signup_round_id         :bigint           not null
#  user_con_profile_id     :bigint
#
# Indexes
#
#  index_ranked_choice_decisions_on_signup_id                (signup_id)
#  index_ranked_choice_decisions_on_signup_ranked_choice_id  (signup_ranked_choice_id)
#  index_ranked_choice_decisions_on_signup_request_id        (signup_request_id)
#  index_ranked_choice_decisions_on_signup_round_id          (signup_round_id)
#  index_ranked_choice_decisions_on_user_con_profile_id      (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (signup_id => signups.id)
#  fk_rails_...  (signup_ranked_choice_id => signup_ranked_choices.id)
#  fk_rails_...  (signup_request_id => signup_requests.id)
#  fk_rails_...  (signup_round_id => signup_rounds.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
class RankedChoiceDecision < ApplicationRecord
  belongs_to :user_con_profile
  belongs_to :signup_round
  belongs_to :signup_ranked_choice, optional: true
  belongs_to :signup, optional: true
  belongs_to :signup_request, optional: true

  DECISIONS = %w[signup waitlist skip_user skip_choice]
  REASONS = %w[missing_ticket no_more_signups_allowed no_pending_choices conflict full ranked_choice_user_constraints]

  validates :decision, inclusion: { in: DECISIONS }
  validates :reason, inclusion: { in: REASONS, allow_nil: true }

  private

  def signup_ranked_choice_must_match_user_con_profile_if_present
    return unless signup_ranked_choice
    return if signup_ranked_choice.user_con_profile_id == user_con_profile_id

    errors.add :signup_ranked_choice, "user_con_profile_id must match ranked_choice_decision's user_con_profile_id"
  end
end
