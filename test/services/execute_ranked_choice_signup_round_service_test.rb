require "test_helper"

describe ExecuteRankedChoiceSignupRoundService do
  let(:convention) { create(:convention, :with_notification_templates) }
  let(:one_player_registration_policy) do
    RegistrationPolicy.new({ buckets: [{ key: "only_one_player", total_slots: 1, slots_limited: true }] })
  end
  let(:event) { create(:event, convention:, registration_policy: one_player_registration_policy) }
  let(:the_run) { create(:run, event:) }

  describe "ordering" do
    it "does not require an order if the round does not sign people up" do
      not_yet_round = create(:signup_round, convention:, maximum_event_signups: "not_yet", start: 2.days.ago)
      first_round =
        create(:signup_round, convention:, ranked_choice_order: "asc", maximum_event_signups: "1", start: 1.day.ago)
      second_first_round =
        create(:signup_round, convention:, ranked_choice_order: "asc", maximum_event_signups: "1", start: 6.hours.ago)
      not_now_round =
        create(
          :signup_round,
          convention:,
          ranked_choice_order: "asc",
          maximum_event_signups: "not_now",
          start: Time.now
        )

      [not_yet_round, first_round, second_first_round, not_now_round].each_with_index do |round, index|
        result = ExecuteRankedChoiceSignupRoundService.new(signup_round: round, whodunit: nil).call
        assert result.success?, "Executing round #{index + 1} failed: #{result.exception}"
      end
    end

    it "does ascending order correctly" do
      signup_round = create(:signup_round, convention:, ranked_choice_order: "asc")
      boost_1_user = create(:user_con_profile, convention:, lottery_number: -1, ranked_choice_ordering_boost: 1)
      boost_2_user = create(:user_con_profile, convention:, lottery_number: 0, ranked_choice_ordering_boost: 2)
      low_number_user = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_allow_waitlist: false)
      high_number_user = create(:user_con_profile, convention:, lottery_number: 2, ranked_choice_allow_waitlist: false)
      create(:signup_ranked_choice, user_con_profile: low_number_user, target_run: the_run)
      create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: the_run)

      result = ExecuteRankedChoiceSignupRoundService.new(signup_round:, whodunit: nil).call!

      assert_equal 4, result.decisions.size
      assert_equal "skip_user", result.decisions[0].decision
      assert_equal "no_pending_choices", result.decisions[0].reason
      assert_equal boost_2_user, result.decisions[0].user_con_profile
      assert_equal "skip_user", result.decisions[1].decision
      assert_equal "no_pending_choices", result.decisions[1].reason
      assert_equal boost_1_user, result.decisions[1].user_con_profile
      assert_equal "signup", result.decisions[2].decision
      assert_equal low_number_user, result.decisions[2].user_con_profile
      assert_equal "skip_choice", result.decisions[3].decision
      assert_equal "full", result.decisions[3].reason
      assert_equal high_number_user, result.decisions[3].user_con_profile

      [boost_1_user, boost_2_user, low_number_user, high_number_user].each do |user|
        assert_equal 0, user.reload.ranked_choice_ordering_boost
      end
    end

    it "does descending order correctly" do
      signup_round = create(:signup_round, convention:, ranked_choice_order: "desc")
      boost_1_user = create(:user_con_profile, convention:, lottery_number: 4, ranked_choice_ordering_boost: 1)
      boost_2_user = create(:user_con_profile, convention:, lottery_number: 3, ranked_choice_ordering_boost: 2)
      low_number_user = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_allow_waitlist: false)
      high_number_user = create(:user_con_profile, convention:, lottery_number: 2, ranked_choice_allow_waitlist: false)
      create(:signup_ranked_choice, user_con_profile: low_number_user, target_run: the_run)
      create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: the_run)

      result = ExecuteRankedChoiceSignupRoundService.new(signup_round:, whodunit: nil).call!

      assert_equal 4, result.decisions.size
      assert_equal "skip_user", result.decisions[0].decision
      assert_equal "no_pending_choices", result.decisions[0].reason
      assert_equal boost_2_user, result.decisions[0].user_con_profile
      assert_equal "skip_user", result.decisions[1].decision
      assert_equal "no_pending_choices", result.decisions[1].reason
      assert_equal boost_1_user, result.decisions[1].user_con_profile
      assert_equal "signup", result.decisions[2].decision
      assert_equal high_number_user, result.decisions[2].user_con_profile
      assert_equal "skip_choice", result.decisions[3].decision
      assert_equal "full", result.decisions[3].reason
      assert_equal low_number_user, result.decisions[3].user_con_profile

      [boost_1_user, boost_2_user, low_number_user, high_number_user].each do |user|
        assert_equal 0, user.reload.ranked_choice_ordering_boost
      end
    end

    it "does ascending serpentine order correctly" do
      signup_round =
        create(:signup_round, convention:, ranked_choice_order: "asc_serpentine", maximum_event_signups: "unlimited")
      boost_1_user = create(:user_con_profile, convention:, lottery_number: -1, ranked_choice_ordering_boost: 1)
      boost_2_user = create(:user_con_profile, convention:, lottery_number: 0, ranked_choice_ordering_boost: 2)
      low_number_user = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_allow_waitlist: false)
      high_number_user = create(:user_con_profile, convention:, lottery_number: 2, ranked_choice_allow_waitlist: false)
      another_run = create(:run, event:, starts_at: the_run.ends_at)
      yet_another_run = create(:run, event:, starts_at: another_run.ends_at)
      create(:signup_ranked_choice, user_con_profile: low_number_user, target_run: the_run, priority: 1)
      create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: the_run, priority: 1)
      create(:signup_ranked_choice, user_con_profile: low_number_user, target_run: another_run, priority: 2)
      create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: another_run, priority: 2)
      create(:signup_ranked_choice, user_con_profile: low_number_user, target_run: yet_another_run, priority: 3)

      result = ExecuteRankedChoiceSignupRoundService.new(signup_round:, whodunit: nil).call!

      assert_equal 10, result.decisions.size
      assert_equal "skip_user", result.decisions[0].decision
      assert_equal "no_pending_choices", result.decisions[0].reason
      assert_equal boost_2_user, result.decisions[0].user_con_profile
      assert_equal "skip_user", result.decisions[1].decision
      assert_equal "no_pending_choices", result.decisions[1].reason
      assert_equal boost_1_user, result.decisions[1].user_con_profile
      assert_equal "signup", result.decisions[2].decision
      assert_equal low_number_user, result.decisions[2].user_con_profile
      assert_equal the_run, result.decisions[2].signup_ranked_choice.result_signup.run
      assert_equal "skip_choice", result.decisions[3].decision
      assert_equal "full", result.decisions[3].reason
      assert_equal high_number_user, result.decisions[3].user_con_profile
      assert_equal "signup", result.decisions[4].decision
      assert_equal high_number_user, result.decisions[4].user_con_profile
      assert_equal another_run, result.decisions[4].signup_ranked_choice.result_signup.run
      assert_equal "skip_choice", result.decisions[5].decision
      assert_equal "full", result.decisions[5].reason
      assert_equal high_number_user, result.decisions[5].user_con_profile
      assert_equal "skip_choice", result.decisions[6].decision
      assert_equal "full", result.decisions[6].reason
      assert_equal low_number_user, result.decisions[6].user_con_profile
      assert_equal "signup", result.decisions[7].decision
      assert_equal low_number_user, result.decisions[7].user_con_profile
      assert_equal yet_another_run, result.decisions[7].signup_ranked_choice.result_signup.run
      assert_equal "skip_user", result.decisions[8].decision
      assert_equal "no_pending_choices", result.decisions[8].reason
      assert_equal boost_1_user, result.decisions[8].user_con_profile
      assert_equal "skip_user", result.decisions[9].decision
      assert_equal "no_pending_choices", result.decisions[9].reason
      assert_equal boost_2_user, result.decisions[9].user_con_profile

      [boost_1_user, boost_2_user, low_number_user, high_number_user].each do |user|
        assert_equal 0, user.reload.ranked_choice_ordering_boost
      end
    end

    it "does descending serpentine order correctly" do
      signup_round =
        create(:signup_round, convention:, ranked_choice_order: "desc_serpentine", maximum_event_signups: "unlimited")
      boost_1_user = create(:user_con_profile, convention:, lottery_number: 4, ranked_choice_ordering_boost: 1)
      boost_2_user = create(:user_con_profile, convention:, lottery_number: 3, ranked_choice_ordering_boost: 2)
      low_number_user = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_allow_waitlist: false)
      high_number_user = create(:user_con_profile, convention:, lottery_number: 2, ranked_choice_allow_waitlist: false)
      another_run = create(:run, event:, starts_at: the_run.ends_at)
      yet_another_run = create(:run, event:, starts_at: another_run.ends_at)
      create(:signup_ranked_choice, user_con_profile: low_number_user, target_run: the_run, priority: 1)
      create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: the_run, priority: 1)
      create(:signup_ranked_choice, user_con_profile: low_number_user, target_run: another_run, priority: 2)
      create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: another_run, priority: 2)
      create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: yet_another_run, priority: 3)

      result = ExecuteRankedChoiceSignupRoundService.new(signup_round:, whodunit: nil).call!

      assert_equal 10, result.decisions.size
      assert_equal "skip_user", result.decisions[0].decision
      assert_equal "no_pending_choices", result.decisions[0].reason
      assert_equal boost_2_user, result.decisions[0].user_con_profile
      assert_equal "skip_user", result.decisions[1].decision
      assert_equal "no_pending_choices", result.decisions[1].reason
      assert_equal boost_1_user, result.decisions[1].user_con_profile
      assert_equal "signup", result.decisions[2].decision
      assert_equal high_number_user, result.decisions[2].user_con_profile
      assert_equal the_run, result.decisions[2].signup_ranked_choice.result_signup.run
      assert_equal "skip_choice", result.decisions[3].decision
      assert_equal "full", result.decisions[3].reason
      assert_equal low_number_user, result.decisions[3].user_con_profile
      assert_equal "signup", result.decisions[4].decision
      assert_equal low_number_user, result.decisions[4].user_con_profile
      assert_equal another_run, result.decisions[4].signup_ranked_choice.result_signup.run
      assert_equal "skip_choice", result.decisions[5].decision
      assert_equal "full", result.decisions[5].reason
      assert_equal low_number_user, result.decisions[5].user_con_profile
      assert_equal "skip_choice", result.decisions[6].decision
      assert_equal "full", result.decisions[6].reason
      assert_equal high_number_user, result.decisions[6].user_con_profile
      assert_equal "signup", result.decisions[7].decision
      assert_equal high_number_user, result.decisions[7].user_con_profile
      assert_equal yet_another_run, result.decisions[7].signup_ranked_choice.result_signup.run
      assert_equal "skip_user", result.decisions[8].decision
      assert_equal "no_pending_choices", result.decisions[8].reason
      assert_equal boost_1_user, result.decisions[8].user_con_profile
      assert_equal "skip_user", result.decisions[9].decision
      assert_equal "no_pending_choices", result.decisions[9].reason
      assert_equal boost_2_user, result.decisions[9].user_con_profile

      [boost_1_user, boost_2_user, low_number_user, high_number_user].each do |user|
        assert_equal 0, user.reload.ranked_choice_ordering_boost
      end
    end

    it "rejects unknown orderings" do
      signup_round = create(:signup_round, convention:)

      error =
        assert_raises(StandardError) { ExecuteRankedChoiceSignupRoundService.new(signup_round:, whodunit: nil).call! }

      assert_equal "Unknown order for executing signup choices: nil", error.message
    end
  end

  it "respects the ranked_choice_allow_waitlist flag for a user profile" do
    signup_round = create(:signup_round, convention:, ranked_choice_order: "asc")
    low_number_user = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_allow_waitlist: false)
    high_number_user = create(:user_con_profile, convention:, lottery_number: 2, ranked_choice_allow_waitlist: true)
    create(:signup_ranked_choice, user_con_profile: low_number_user, target_run: the_run)
    create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: the_run)

    result = ExecuteRankedChoiceSignupRoundService.new(signup_round:, whodunit: nil).call!

    assert_equal 3, result.decisions.size
    assert_equal "signup", result.decisions[0].decision
    assert_equal low_number_user, result.decisions[0].user_con_profile
    assert_equal "skip_choice", result.decisions[1].decision
    assert_equal high_number_user, result.decisions[1].user_con_profile
    assert_equal "waitlist", result.decisions[2].decision
    assert_equal high_number_user, result.decisions[2].user_con_profile
  end

  it "skips users who haven't made any choices" do
    signup_round = create(:signup_round, convention:, ranked_choice_order: "asc", maximum_event_signups: "1")
    low_number_user = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_allow_waitlist: false)
    high_number_user = create(:user_con_profile, convention:, lottery_number: 2, ranked_choice_allow_waitlist: true)
    create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: the_run)

    result = ExecuteRankedChoiceSignupRoundService.new(signup_round:, whodunit: nil).call!

    assert_equal 2, result.decisions.size
    assert_equal "skip_user", result.decisions[0].decision
    assert_equal "no_pending_choices", result.decisions[0].reason
    assert_equal low_number_user, result.decisions[0].user_con_profile
    assert_equal "signup", result.decisions[1].decision
    assert_equal high_number_user, result.decisions[1].user_con_profile
  end

  it "skips users who already have the max number of signups for this round" do
    signup_round = create(:signup_round, convention:, ranked_choice_order: "asc", maximum_event_signups: "1")
    low_number_user = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_allow_waitlist: false)
    high_number_user = create(:user_con_profile, convention:, lottery_number: 2, ranked_choice_allow_waitlist: true)
    create(:signup_ranked_choice, user_con_profile: low_number_user, target_run: the_run)
    create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: the_run)
    other_event = create(:event, convention:, registration_policy: one_player_registration_policy)
    other_run = create(:run, event: other_event)
    create(:signup, user_con_profile: low_number_user, run: other_run)

    result = ExecuteRankedChoiceSignupRoundService.new(signup_round:, whodunit: nil).call!

    assert_equal 2, result.decisions.size
    assert_equal "skip_user", result.decisions[0].decision
    assert_equal "no_more_signups_allowed", result.decisions[0].reason
    assert_equal low_number_user, result.decisions[0].user_con_profile
    assert_equal "signup", result.decisions[1].decision
    assert_equal high_number_user, result.decisions[1].user_con_profile
  end

  it "keeps going until no users have signups left" do
    signup_round = create(:signup_round, convention:, ranked_choice_order: "asc", maximum_event_signups: "2")
    low_number_user = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_allow_waitlist: false)
    high_number_user = create(:user_con_profile, convention:, lottery_number: 2, ranked_choice_allow_waitlist: true)
    low_first_run = create(:signup_ranked_choice, user_con_profile: low_number_user, target_run: the_run)
    high_first_run = create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: the_run)
    other_event = create(:event, convention:, registration_policy: one_player_registration_policy)
    other_run = create(:run, event: other_event, starts_at: 1.day.from_now)
    unlimited_event = create(:event, convention:, registration_policy: RegistrationPolicy.unlimited)
    unlimited_run = create(:run, event: unlimited_event, starts_at: 2.days.from_now)
    create(:signup_ranked_choice, user_con_profile: low_number_user, target_run: unlimited_run)
    high_unlimited_run = create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: unlimited_run)
    high_duplicate_unlimited_run =
      create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: unlimited_run)
    create(:signup, user_con_profile: low_number_user, run: other_run)

    result = ExecuteRankedChoiceSignupRoundService.new(signup_round:, whodunit: nil).call!

    assert_equal [
                   [low_first_run.id, "signup", nil],
                   [high_first_run.id, "skip_choice", "full"],
                   [high_unlimited_run.id, "signup", nil],
                   [nil, "skip_user", "no_more_signups_allowed"],
                   [high_first_run.id, "skip_choice", "full"],
                   [high_duplicate_unlimited_run.id, "skip_choice", "conflict"],
                   [high_first_run.id, "waitlist", nil]
                 ],
                 (
                   result.decisions.map do |decision|
                     [decision.signup_ranked_choice_id, decision.decision, decision.reason]
                   end
                 )
    assert_equal [[the_run.id, "confirmed"], [other_run.id, "confirmed"]].sort,
                 low_number_user.signups.map { |signup| [signup.run_id, signup.state] }.sort
    assert_equal [[the_run.id, "waitlisted"], [unlimited_run.id, "confirmed"]].sort,
                 high_number_user.signups.map { |signup| [signup.run_id, signup.state] }.sort
  end

  describe "in a convention that requires tickets" do
    let(:convention) { create(:convention, :with_notification_templates, ticket_mode: "required_for_signup") }

    it "skips unticketed users" do
      signup_round = create(:signup_round, convention:, ranked_choice_order: "asc")
      low_number_user = create(:user_con_profile, convention:, lottery_number: 1, ranked_choice_allow_waitlist: false)
      high_number_user = create(:user_con_profile, convention:, lottery_number: 2, ranked_choice_allow_waitlist: false)
      create(:signup_ranked_choice, user_con_profile: low_number_user, target_run: the_run)
      create(:signup_ranked_choice, user_con_profile: high_number_user, target_run: the_run)
      create(:ticket, user_con_profile: high_number_user)

      result = ExecuteRankedChoiceSignupRoundService.new(signup_round:, whodunit: nil).call!

      assert_equal 2, result.decisions.size
      assert_equal "skip_user", result.decisions[0].decision
      assert_equal "missing_ticket", result.decisions[0].reason
      assert_equal low_number_user, result.decisions[0].user_con_profile
      assert_equal "signup", result.decisions[1].decision
      assert_equal high_number_user, result.decisions[1].user_con_profile
    end
  end
end
