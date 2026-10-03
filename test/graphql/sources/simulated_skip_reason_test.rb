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

  it "does not modify any records" do
    choice = choice_for(create(:event, convention:))

    assert_no_difference %w[Signup.count RankedChoiceDecision.count] do
      Sources::SimulatedSkipReason.new(user_con_profile).fetch([choice])
    end
    assert_equal "pending", choice.reload.state
  end
end
