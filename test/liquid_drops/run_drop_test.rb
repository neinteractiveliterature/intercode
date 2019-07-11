require 'test_helper'

describe RunDrop do
  let(:the_run) { create(:run) }
  let(:run_drop) { RunDrop.new(the_run) }
  let(:event) { the_run.event }

  %w[event starts_at ends_at length_seconds].each do |field|
    it "returns the #{field} of the run" do
      run_drop.public_send(field).must_equal the_run.public_send(field)
    end
  end

  it 'returns the event path' do
    run_drop.event_url.must_match %r{events/#{event.id}}
  end
end
