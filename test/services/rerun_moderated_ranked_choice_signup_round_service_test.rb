# frozen_string_literal: true
require "test_helper"

describe RerunModeratedRankedChoiceSignupRoundService do
  let(:convention) { create(:convention, :with_notification_templates, signup_mode: "moderated") }
  let(:signup_round) do
    create(:signup_round, convention:, ranked_choice_order: "asc", maximum_event_signups: "1", start: 1.day.ago)
  end
  def one_player_registration_policy
    RegistrationPolicy.new(
      buckets: [
        RegistrationPolicyBucket.new(
          key: "only_one_player",
          name: "Only one player",
          total_slots: 1,
          slots_limited: true
        )
      ]
    )
  end

  def create_ranked_choices(user_con_profile, count)
    (1..count).map do |i|
      event = create(:event, convention:, registration_policy: one_player_registration_policy)
      run = create(:run, event:, starts_at: convention.starts_at + (i * 5).hours)
      create(:signup_ranked_choice, user_con_profile:, target_run: run)
    end
  end

  def execute_round
    ExecuteRankedChoiceSignupRoundService.new(signup_round:, whodunit: nil).call!
  end

  def rerun_round
    max_decision_id = RankedChoiceDecision.maximum(:id) || 0
    result = RerunModeratedRankedChoiceSignupRoundService.new(signup_round:, whodunit: nil).call!
    assert result.success?
    RankedChoiceDecision.where("id > ?", max_decision_id).order(:id).to_a
  end

  def pending_choice_ids(user_con_profile)
    user_con_profile.signup_ranked_choices.where(state: "pending").order(:priority).pluck(:id)
  end

  it "records the next pending choice as after_signup_ranked_choice when executing" do
    user_con_profile = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_fallback_action: "none")
    choices = create_ranked_choices(user_con_profile, 3)

    result = execute_round

    signup_decision = result.decisions.find { |decision| decision.decision == "signup" }
    assert_equal choices[0], signup_decision.signup_ranked_choice
    assert_equal choices[1], signup_decision.after_signup_ranked_choice
  end

  it "re-requests the same choice for attendees whose requests were still pending" do
    rejected_user = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_fallback_action: "none")
    pending_user = create(:user_con_profile, convention:, lottery_number: 2, ranked_choice_fallback_action: "none")
    rejected_user_choices = create_ranked_choices(rejected_user, 2)
    pending_user_choices = create_ranked_choices(pending_user, 3)

    execute_round
    rejected_user_choices[0].reload.result_signup_request.update!(state: "rejected")
    original_pending_request = pending_user_choices[0].reload.result_signup_request

    rerun_round

    # The attendee with the rejected request should advance to their second choice
    assert_equal "requested", rejected_user_choices[1].reload.state
    assert_equal "pending", rejected_user_choices[1].result_signup_request.state

    # The attendee whose request was still pending should have the same choice re-requested
    assert_equal "requested", pending_user_choices[0].reload.state
    new_request = pending_user_choices[0].result_signup_request
    assert_equal "pending", new_request.state
    assert_not_equal original_pending_request.id, new_request.id
    assert_equal pending_user_choices[0].target_run, new_request.target_run
    assert_equal [pending_user_choices[1].id, pending_user_choices[2].id], pending_choice_ids(pending_user)
  end

  it "does not advance attendees with pending requests across multiple reruns" do
    rejected_user = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_fallback_action: "none")
    pending_user = create(:user_con_profile, convention:, lottery_number: 2, ranked_choice_fallback_action: "none")
    rejected_user_choices = create_ranked_choices(rejected_user, 3)
    pending_user_choices = create_ranked_choices(pending_user, 3)

    execute_round
    rejected_user_choices[0].reload.result_signup_request.update!(state: "rejected")
    rerun_round
    rejected_user_choices[1].reload.result_signup_request.update!(state: "rejected")
    rerun_round

    assert_equal "requested", rejected_user_choices[2].reload.state
    assert_equal "pending", rejected_user_choices[2].result_signup_request.state

    assert_equal "requested", pending_user_choices[0].reload.state
    assert_equal "pending", pending_user_choices[0].result_signup_request.state
    assert_equal pending_user_choices[0].target_run, pending_user_choices[0].result_signup_request.target_run
    assert_equal [pending_user_choices[1].id, pending_user_choices[2].id], pending_choice_ids(pending_user)
  end

  it "restores a choice that was the last pending choice to the end of the list" do
    user_con_profile = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_fallback_action: "none")
    choices = create_ranked_choices(user_con_profile, 2)
    create(:signup, run: choices[0].target_run, state: "confirmed")

    result = execute_round
    original_decisions = result.decisions.select { |decision| decision.user_con_profile == user_con_profile }
    assert_equal %w[skip_choice signup], original_decisions.map(&:decision)

    rerun_decisions = rerun_round.select { |decision| decision.user_con_profile == user_con_profile }

    # The full first choice should still be considered (and skipped) before the second choice
    # is re-requested
    assert_equal %w[skip_choice signup], rerun_decisions.map(&:decision)
    assert_equal choices[0], rerun_decisions[0].signup_ranked_choice
    assert_equal choices[1], rerun_decisions[1].signup_ranked_choice
    assert_equal [choices[0].id], pending_choice_ids(user_con_profile)
  end

  it "skips restoring choices that have been deleted" do
    user_con_profile = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_fallback_action: "none")
    choices = create_ranked_choices(user_con_profile, 2)

    execute_round
    original_request = choices[0].reload.result_signup_request
    choices[0].destroy!

    rerun_round

    assert_not SignupRequest.exists?(original_request.id)
    assert_equal "requested", choices[1].reload.state
    assert_equal "pending", choices[1].result_signup_request.state
  end

  describe "with a round allowing multiple signups" do
    let(:signup_round) do
      create(:signup_round, convention:, ranked_choice_order: "asc", maximum_event_signups: "2", start: 1.day.ago)
    end

    it "restores multiple undone choices in their original order" do
      user_con_profile =
        create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_fallback_action: "none")
      choices = create_ranked_choices(user_con_profile, 3)

      execute_round
      assert_equal(%w[requested requested pending], choices.map { |choice| choice.reload.state })

      rerun_decisions = rerun_round

      assert_equal [choices[0], choices[1]], rerun_decisions.map(&:signup_ranked_choice)
      assert_equal(%w[requested requested pending], choices.map { |choice| choice.reload.state })
      assert_equal [choices[2].id], pending_choice_ids(user_con_profile)
    end
  end
end
