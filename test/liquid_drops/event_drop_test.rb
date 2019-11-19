require 'test_helper'

describe EventDrop do
  let(:event) { create(:event) }
  let(:event_drop) { EventDrop.new(event) }

  it 'returns the title of the event' do
    assert_equal event.title, event_drop.title
  end

  it 'returns the team member name of the event category' do
    assert_equal event.event_category.team_member_name, event_drop.team_member_name
  end

  describe 'with team members' do
    let(:team_members) { 5.times.map { create(:team_member, event: event) } }

    before do
      team_members
    end

    it 'returns the user con profiles of the team members of the event' do
      assert_equal team_members.map(&:user_con_profile_id).sort, event_drop.team_member_user_con_profiles.map(&:id).sort
    end
  end

  it 'returns the event path' do
    assert_match %r{events/#{event.id}}, event_drop.url
  end
end
