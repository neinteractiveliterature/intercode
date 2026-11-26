require "test_helper"

describe ConventionDrop do
  let(:convention) { create(:convention) }
  let(:convention_drop) { ConventionDrop.new(convention) }

  it "returns the convention's name" do
    assert_equal convention.name, convention_drop.name
  end

  it "only builds run availabilities once, however many filtered lists a template asks for" do
    create(:run, event: create(:event, convention: convention))

    # Identity rather than a query count: the query cache would hide the repeat queries, but not the repeat work
    assert_same convention_drop.run_availabilities, convention_drop.run_availabilities
  end

  it "returns bio-eligible profiles without querying again for what bio pages show about each one" do
    active_event = create(:event, convention:)
    dropped_event = create(:event, convention:, status: "dropped")
    profile = create(:team_member, event: active_event).user_con_profile
    create(:team_member, event: dropped_event, user_con_profile: profile)
    create(:team_member, event: active_event)

    drops = convention_drop.bio_eligible_user_con_profiles.map { |attendee| UserConProfileDrop.new(attendee) }

    queries =
      count_queries(/SELECT/) do
        drops.each do |drop|
          drop.email
          drop.gravatar_url
          drop.staff_positions
          drop.team_member_events.each { |event| event.event_category.name }
        end
      end

    assert_equal 0, queries
    assert_equal [active_event], drops.find { |drop| drop.id == profile.id }.team_member_events
  end

  describe "with runs that have openings" do
    # Deliberately not `let` (memoized) -- each event needs its own independent RegistrationPolicy
    # row, and this file creates multiple events that would otherwise collide on the new unique
    # index on events.registration_policy_id.
    def limited_registration_policy
      RegistrationPolicy.build_from_hash(
        buckets: [
          { key: "dogs", name: "dogs", slots_limited: true, total_slots: 3 },
          { key: "cats", name: "cats", slots_limited: true, total_slots: 2 },
          { key: "anything", name: "flex", slots_limited: true, total_slots: 4, anything: true }
        ]
      )
    end
    let(:event_with_openings) do
      create(:event, convention: convention, registration_policy: limited_registration_policy)
    end
    let(:run_with_openings) { create(:run, event: event_with_openings) }
    let(:unlimited_event_with_openings) { create(:event, convention: convention) }
    let(:unlimited_run_with_openings) { create(:run, event: unlimited_event_with_openings) }
    let(:volunteer_event_category) { create(:event_category, convention: convention, name: "Volunteer event") }
    let(:volunteer_event_with_openings) do
      create(
        :event,
        convention: convention,
        event_category: volunteer_event_category,
        registration_policy: limited_registration_policy
      )
    end
    let(:volunteer_run_with_openings) { create(:run, event: volunteer_event_with_openings) }
    let(:event_without_openings) { create(:event, convention: convention, registration_policy: RegistrationPolicy.new) }
    let(:run_without_openings) { create(:run, event: event_without_openings) }

    before do
      run_with_openings
      unlimited_run_with_openings
      volunteer_run_with_openings
      run_without_openings
    end

    it "returns all runs with limited-slot openings" do
      assert_includes convention_drop.runs_with_openings, run_with_openings
      assert_includes convention_drop.runs_with_openings, volunteer_run_with_openings
      assert_not_includes convention_drop.runs_with_openings, run_without_openings
      assert_not_includes convention_drop.runs_with_openings, unlimited_run_with_openings
    end

    it "returns all non-volunteer runs with limited-slot openings" do
      assert_includes convention_drop.non_volunteer_runs_with_openings, run_with_openings
      assert_not_includes convention_drop.non_volunteer_runs_with_openings, volunteer_run_with_openings
      assert_not_includes convention_drop.non_volunteer_runs_with_openings, run_without_openings
      assert_not_includes convention_drop.non_volunteer_runs_with_openings, unlimited_run_with_openings
    end
  end
end
