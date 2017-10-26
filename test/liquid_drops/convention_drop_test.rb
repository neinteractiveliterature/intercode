require 'test_helper'

describe ConventionDrop do
  let(:convention) { FactoryBot.create(:convention) }
  let(:convention_drop) { ConventionDrop.new(convention) }

  it "returns the convention's name" do
    convention_drop.name.must_equal convention.name
  end

  describe 'with runs that have openings' do
    let(:event_with_openings) { FactoryBot.create(:event, convention: convention) }
    let(:run_with_openings) { FactoryBot.create(:run, event: event_with_openings) }
    let(:volunteer_event_with_openings) { FactoryBot.create(:event, convention: convention, category: 'volunteer_event') }
    let(:volunteer_run_with_openings) { FactoryBot.create(:run, event: volunteer_event_with_openings) }
    let(:event_without_openings) { FactoryBot.create(:event, convention: convention, registration_policy: RegistrationPolicy.new) }
    let(:run_without_openings) { FactoryBot.create(:run, event: event_without_openings) }

    before do
      run_with_openings
      volunteer_run_with_openings
      run_without_openings
    end

    it 'returns all runs with openings' do
      convention_drop.runs_with_openings.must_include run_with_openings
      convention_drop.runs_with_openings.must_include volunteer_run_with_openings
      convention_drop.runs_with_openings.wont_include run_without_openings
    end

    it 'returns all non-volunteer runs with openings' do
      convention_drop.non_volunteer_runs_with_openings.must_include run_with_openings
      convention_drop.non_volunteer_runs_with_openings.wont_include volunteer_run_with_openings
      convention_drop.non_volunteer_runs_with_openings.wont_include run_without_openings
    end
  end
end