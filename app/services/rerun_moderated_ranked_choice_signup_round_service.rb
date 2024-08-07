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
    priority =
      (
        if decision.after_signup_ranked_choice&.state == "pending"
          { after: decision.after_signup_ranked_choice }
        else
          :first
        end
      )

    signup_ranked_choice.update!(state: "pending", priority:)
    signup_request.destroy!
  end
end
