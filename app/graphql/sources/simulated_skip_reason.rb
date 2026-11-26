# frozen_string_literal: true
class Sources::SimulatedSkipReason < GraphQL::Dataloader::Source
  attr_reader :user_con_profile, :constraints

  def initialize(user_con_profile)
    super()
    @user_con_profile = user_con_profile
    @constraints = UserSignupConstraints.new(user_con_profile)
  end

  def fetch(keys)
    preload(keys)
    result = nil

    # Do this in an always-rolled-back transaction to avoid the possibility of accidentally modifying records
    ActiveRecord::Base.transaction do
      result =
        keys.map do |signup_ranked_choice|
          ExecuteRankedChoiceSignupService.new(
            signup_round: nil,
            whodunit: nil,
            signup_ranked_choice:,
            # simulate: true makes the service always return a reason for full events (so the frontend can show the
            # appropriate message), while still correctly reporting waitlist_position_cap_exceeded when applicable
            allow_waitlist: false,
            simulate_waitlist_cap: true,
            constraints:,
            existing_signups: existing_signups_by_run_id&.fetch(signup_ranked_choice.target_run_id, [])
          ).skip_reason
        end
      raise ActiveRecord::Rollback
    end

    result
  end

  private

  # Everything the service reads for each choice, so that simulating a queue doesn't query once per choice
  def preload(signup_ranked_choices)
    ::ActiveRecord::Associations::Preloader.new(
      records: signup_ranked_choices,
      associations: [
        :requested_bucket,
        { user_con_profile: :convention },
        { target_run: { event: [:convention, :team_members, { registration_policy: :buckets }] } }
      ]
    ).call
    @target_run_ids = signup_ranked_choices.map(&:target_run_id)
  end

  # In moderated conventions, simulating pending signup requests reassigns the buckets of the signups it's given, so
  # each choice there has to load its own copies
  def existing_signups_by_run_id
    return if user_con_profile.convention.signup_mode == "moderated"

    @existing_signups_by_run_id ||=
      Signup
        .where(run_id: @target_run_ids)
        .counted
        .occupying_slot
        .includes(:run, :user_con_profile, :bucket, :requested_bucket)
        .group_by(&:run_id)
  end
end
