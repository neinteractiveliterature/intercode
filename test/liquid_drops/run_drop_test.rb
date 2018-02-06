require 'test_helper'

describe RunDrop do
  let(:the_run) { FactoryBot.create(:run) }
  let(:run_drop) { RunDrop.new(the_run) }
  let(:event) { the_run.event }

  %w[event starts_at ends_at length_seconds].each do |field|
    it "returns the #{field} of the run" do
      run_drop.public_send(field).must_equal the_run.public_send(field)
    end
  end

  it 'returns the event path' do
    run_drop.event_url.must_match /events\/#{event.id}/
  end

  it 'returns the signup path' do
    run_drop.signup_url.must_match /runs\/#{the_run.id}\/user_signup/
  end

  it 'returns the withdraw path' do
    run_drop.withdraw_url.must_match /runs\/#{the_run.id}\/user_signup/
  end
end
