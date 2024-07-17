# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: signup_rounds
#
#  id                    :bigint           not null, primary key
#  executed_at           :datetime
#  maximum_event_signups :text             not null
#  ranked_choice_order   :text
#  start                 :datetime
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  convention_id         :bigint           not null
#
# Indexes
#
#  index_signup_rounds_on_convention_id  (convention_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
class SignupRound < ApplicationRecord
  RANKED_CHOICE_ORDERS = Types::RankedChoiceOrder.values.values.map(&:value).freeze

  belongs_to :convention
  has_many :ranked_choice_decisions, dependent: :restrict_with_exception

  validates :ranked_choice_order, inclusion: { in: RANKED_CHOICE_ORDERS, allow_nil: true }
  validates :start, { uniqueness: { scope: :convention_id } }

  scope :due_at, ->(time) { where("executed_at IS NULL AND (start IS NULL OR start <= ?)", time) }
  scope :currently_due, -> { due_at(Time.zone.now) }
  scope :chronological, -> { order("start ASC NULLS FIRST") }
  scope :reverse_chronological, -> { order("start DESC NULLS LAST") }

  def self.execute_currently_due_rounds!
    currently_due.chronological.includes(:convention).find_each(&:execute!)
  end

  def execute!
    transaction do
      if convention.signup_automation_mode == "ranked_choice"
        ExecuteRankedChoiceSignupRoundService.new(signup_round: self, whodunit: nil).call!
      end

      update!(executed_at: Time.zone.now)
    end
  end

  def maximum_event_signups_as_number
    case maximum_event_signups
    when "not_yet", "not_now"
      0
    when "unlimited"
      Float::INFINITY
    else
      maximum_event_signups.to_i
    end
  end

  def serpentine_ranked_choice_order?
    case ranked_choice_order
    when "asc_serpentine", "desc_serpentine"
      true
    else
      false
    end
  end
end
