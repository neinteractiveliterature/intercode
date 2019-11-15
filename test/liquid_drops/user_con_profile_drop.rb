require 'test_helper'

describe UserConProfileDrop do
  let(:ticket) { create(:ticket) }
  let(:user_con_profile) { ticket.user_con_profile }
  let(:user_con_profile_drop) { UserConProfileDrop.new(user_con_profile) }
  let(:convention) { user_con_profile.convention }
  let(:events) { 5.times.map { create(:event, convention: convention) } }

  %w[email first_name last_name nickname ticket].each do |field|
    it "returns the #{field} of the user con profile" do
      assert_equal user_con_profile.public_send(field), user_con_profile_drop.public_send(field)
    end
  end

  describe 'with team member events' do
    let(:team_members) { events.map { |event| create(:team_member, user_con_profile: user_con_profile, event: event) } }

    before do
      team_members
    end

    it 'returns the events for which the user con profile is a team member' do
      assert_equal events.map(&:id).sort, user_con_profile_drop.team_member_events.map(&:id).sort
    end
  end

  describe 'with signups' do
    let(:runs) { events.map { |event| create(:run, event: event) } }
    let(:confirmed_signups) { runs.map { |run| create(:signup, user_con_profile: user_con_profile, run: run, bucket_key: 'unlimited', requested_bucket_key: 'unlimited') } }
    let(:withdrawn_signups) { runs.map { |run| create(:signup, user_con_profile: user_con_profile, run: run, state: 'withdrawn', requested_bucket_key: 'unlimited') } }

    before do
      confirmed_signups
      withdrawn_signups
    end

    it 'returns all the confirmed signups' do
      assert_equal confirmed_signups.map(&:id).sort, user_con_profile_drop.signups.map(&:id).sort
    end

    it 'returns none of the withdrawn signups' do
      signups = user_con_profile_drop.signups
      refute_includes withdrawn_signups.each { |signup| signups, signup }
    end
  end
end
