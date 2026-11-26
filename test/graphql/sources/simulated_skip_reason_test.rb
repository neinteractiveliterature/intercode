# frozen_string_literal: true
require "test_helper"

describe Sources::SimulatedSkipReason do
  let(:convention) { create(:convention, :with_notification_templates) }
  let(:user_con_profile) { create(:user_con_profile, convention:) }

  def choice_for(event, **attrs)
    create(:signup_ranked_choice, target_run: create(:run, event:), user_con_profile:, **attrs)
  end

  def full_event
    create(
      :event,
      convention:,
      registration_policy:
        RegistrationPolicy.new(
          buckets: [RegistrationPolicyBucket.new(key: "limited", name: "Limited", slots_limited: true, total_slots: 0)]
        )
    )
  end

  it "returns nil for choices that could be signed up for" do
    choice = choice_for(create(:event, convention:))

    assert_equal [nil], Sources::SimulatedSkipReason.new(user_con_profile).fetch([choice])
  end

  it "returns the skip reason for choices that would be skipped" do
    full = choice_for(full_event)
    team_member_event = create(:event, convention:)
    create(:team_member, user_con_profile:, event: team_member_event)
    team = choice_for(team_member_event)

    reasons = Sources::SimulatedSkipReason.new(user_con_profile).fetch([full, team])

    assert_equal %i[full team_member], reasons.map(&:reason)
  end

  def one_slot_event
    create(
      :event,
      convention:,
      registration_policy:
        RegistrationPolicy.new(
          buckets: [RegistrationPolicyBucket.new(key: "limited", name: "Limited", slots_limited: true, total_slots: 1)]
        )
    )
  end

  it "counts each run's existing signups against only that run" do
    taken = choice_for(one_slot_event)
    create(:signup, run: taken.target_run, bucket_id: taken.requested_bucket_id)
    open = choice_for(one_slot_event)
    open.target_run.update!(starts_at: taken.target_run.starts_at + 1.day)

    reasons = Sources::SimulatedSkipReason.new(user_con_profile).fetch([taken, open])

    assert_equal([:full, nil], reasons.map { |reason| reason&.reason })
  end

  it "does not query once per choice" do
    ids =
      Array.new(5) do
        choice = choice_for(create(:event, convention:))
        create(:signup, run: choice.target_run)
        choice.id
      end
    choices = SignupRankedChoice.find(ids)
    source = Sources::SimulatedSkipReason.new(UserConProfile.find(user_con_profile.id))
    # Each of these was previously queried by its own id, once for every choice
    per_choice_queries = [
      /FROM "signups" WHERE "signups"."run_id" = /,
      /FROM "team_members" WHERE "team_members"."event_id" = /,
      /FROM "registration_policies" WHERE "registration_policies"."id" = /,
      /FROM "registration_policy_buckets" WHERE "registration_policy_buckets"."(id|registration_policy_id)" = /,
      /FROM "(events|runs|user_con_profiles)" WHERE "\1"."id" = /
    ]

    assert_no_queries_match(Regexp.union(per_choice_queries)) { source.fetch(choices) }
  end

  it "does not modify any records" do
    choice = choice_for(create(:event, convention:))

    assert_no_difference %w[Signup.count RankedChoiceDecision.count] do
      Sources::SimulatedSkipReason.new(user_con_profile).fetch([choice])
    end
    assert_equal "pending", choice.reload.state
  end
end
