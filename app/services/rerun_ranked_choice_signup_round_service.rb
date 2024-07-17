class RerunRankedChoiceSignupRoundService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :decisions
  end
  self.result_class = Result

  include SkippableAdvisoryLock

  attr_reader :signup_round, :whodunit, :skip_locking, :suppress_notifications, :decisions
  delegate :convention, to: :signup_round

  def initialize(signup_round:, whodunit:, skip_locking: false, suppress_notifications: false)
    @signup_round = signup_round
    @whodunit = whodunit
    @skip_locking = skip_locking
    @suppress_notifications = suppress_notifications
    @decisions = []
  end
end
