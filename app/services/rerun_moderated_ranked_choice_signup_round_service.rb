class RerunModeratedRankedChoiceSignupRoundService < CivilService::Service
  include SkippableAdvisoryLock

  attr_reader :signup_round, :whodunit, :skip_locking, :suppress_notifications, :decisions
  delegate :convention, to: :signup_round

  def initialize(signup_round:, whodunit:, skip_locking: false, suppress_notifications: true)
    @signup_round = signup_round
    @whodunit = whodunit
    @skip_locking = skip_locking
    @suppress_notifications = suppress_notifications
  end

  def inner_call
    decisions_to_undo.each { |decision| undo_decision(decision) }
    ExecuteRankedChoiceSignupRoundService.new(signup_round:, whodunit:, skip_locking:, suppress_notifications:).call
  end

  private

  def decisions_to_undo
    @decisions_to_undo ||=
      signup_round.ranked_choice_decisions.joins(:signup_request).where(signup_requests: { state: "pending" })
  end

  def undo_decision(decision)
    signup_ranked_choice = decision.signup_ranked_choice
    signup_request = decision.signup_request
    skips =
      signup_round
        .ranked_choice_decisions
        .joins(:signup_ranked_choice)
        .where(
          user_con_profile: signup_ranked_choice.user_con_profile,
          decision: "skip_choice",
          signup_ranked_choices: {
            state: "pending"
          }
        )
        .includes(:signup_ranked_choice)
    furthest_down_skip = skips.max_by { |skip| skip.signup_ranked_choice.priority }
    priority = furthest_down_skip ? { after: furthest_down_skip.signup_ranked_choice } : :first

    signup_ranked_choice.update!(state: "pending", priority:)
    signup_request.destroy!
    decision.destroy!
  end
end
