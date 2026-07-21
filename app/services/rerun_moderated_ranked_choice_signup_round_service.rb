# frozen_string_literal: true
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
    # Ordered by id so that choices are restored in the order they were executed; that way, if
    # multiple decisions for the same user are undone, restore_signup_ranked_choice can count on
    # earlier choices already being back in the pending list
    @decisions_to_undo ||=
      signup_round
        .ranked_choice_decisions
        .joins(:signup_request)
        .where(signup_requests: { state: "pending" })
        .order(:id)
  end

  def undo_decision(decision)
    restore_signup_ranked_choice(decision) if decision.signup_ranked_choice
    decision.signup_request.destroy!
  end

  def restore_signup_ranked_choice(decision)
    after_signup_ranked_choice = decision.after_signup_ranked_choice
    priority =
      (
        if after_signup_ranked_choice&.state == "pending"
          { before: after_signup_ranked_choice }
        elsif after_signup_ranked_choice
          # The choice that followed this one was executed too; if its decision is also being
          # undone, it will be re-inserted after this one
          :first
        else
          # Nothing followed this choice when it was executed
          :last
        end
      )

    decision.signup_ranked_choice.update!(state: "pending", priority:)
  end
end
