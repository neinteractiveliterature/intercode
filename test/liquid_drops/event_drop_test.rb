require 'test_helper'

describe EventDrop do
  let(:event) { FactoryBot.create(:event) }
  let(:event_drop) { EventDrop.new(event) }

  %w[title team_member_name].each do |field|
    it "returns the #{field} of the event" do
      event_drop.public_send(field).must_equal event.public_send(field)
    end
  end

  describe 'with team members' do
    let(:team_members) { 5.times.map { FactoryBot.create(:team_member, event: event) } }

    before do
      team_members
    end

    it 'returns the user con profiles of the team members of the event' do
      event_drop.team_member_user_con_profiles.map(&:id).sort.must_equal team_members.map(&:user_con_profile_id).sort
    end
  end

  it 'returns the event path' do
    event_drop.url.must_match /events\/#{event.id}/
  end
end
