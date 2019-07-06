require 'test_helper'

describe ConventionDrop do
  let(:convention) { create(:convention) }
  let(:convention_drop) { ConventionDrop.new(convention) }

  it "returns the convention's name" do
    convention_drop.name.must_equal convention.name
  end

  describe 'with runs that have openings' do
    let(:limited_registration_policy) do
      {
        buckets: [
          { key: 'dogs', name: 'dogs', slots_limited: true, total_slots: 3 },
          { key: 'cats', name: 'cats', slots_limited: true, total_slots: 2 },
          { key: 'anything', name: 'flex', slots_limited: true, total_slots: 4, anything: true }
        ]
      }
    end
    let(:event_with_openings) do
      create(
        :event,
        convention: convention,
        registration_policy: limited_registration_policy
      )
    end
    let(:run_with_openings) { create(:run, event: event_with_openings) }
    let(:unlimited_event_with_openings) { create(:event, convention: convention) }
    let(:unlimited_run_with_openings) { create(:run, event: unlimited_event_with_openings) }
    let(:volunteer_event_category) { create(:event_category, convention: convention, name: 'Volunteer event') }
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

    it 'returns all runs with limited-slot openings' do
      convention_drop.runs_with_openings.must_include run_with_openings
      convention_drop.runs_with_openings.must_include volunteer_run_with_openings
      convention_drop.runs_with_openings.wont_include run_without_openings
      convention_drop.runs_with_openings.wont_include unlimited_run_with_openings
    end

    it 'returns all non-volunteer runs with limited-slot openings' do
      convention_drop.non_volunteer_runs_with_openings.must_include run_with_openings
      convention_drop.non_volunteer_runs_with_openings.wont_include volunteer_run_with_openings
      convention_drop.non_volunteer_runs_with_openings.wont_include run_without_openings
      convention_drop.non_volunteer_runs_with_openings.wont_include unlimited_run_with_openings
    end
  end
end
