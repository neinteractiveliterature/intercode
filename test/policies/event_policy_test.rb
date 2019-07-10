require 'test_helper'
require_relative 'event_category_test_helper'

class EventPolicyTest < ActiveSupport::TestCase
  include EventCategoryTestHelper

  let(:convention) { create(:convention, show_schedule: 'no') }
  let(:event_category) { create(:event_category, convention: convention) }
  let(:event) { create(:event, convention: convention, event_category: event_category) }
  let(:dropped_event) do
    create(:event, convention: convention, event_category: event_category, status: 'dropped')
  end
  let(:rando) { create(:user_con_profile, convention: convention) }

  describe '#read?' do
    describe "when show_event_list is 'yes'" do
      before { convention.update!(show_event_list: 'yes') }

      it 'lets anyone read events' do
        convention.update!(show_event_list: 'yes')
        assert EventPolicy.new(nil, event).read?
      end

      it 'lets people with update_events permission read dropped events' do
        user = create_user_with_update_events_in_event_category(event_category)
        assert EventPolicy.new(user, dropped_event).read?
      end

      %w[scheduling gm_liaison staff].each do |priv|
        it "lets #{priv} users read dropped events" do
          user_con_profile = create(
            :user_con_profile, convention: convention, priv => true
          )
          assert EventPolicy.new(user_con_profile.user, dropped_event).read?
        end
      end

      it 'does not let regular users read dropped events' do
        refute EventPolicy.new(rando.user, dropped_event).read?
      end
    end

    describe "when show_event_list is 'gms'" do
      before { convention.update!(show_event_list: 'gms') }

      it 'lets team members read events' do
        team_member = create(:team_member, event: event)
        assert EventPolicy.new(team_member.user_con_profile.user, event).read?
      end

      %w[con_com scheduling gm_liaison staff].each do |priv|
        it "lets #{priv} users read events" do
          user_con_profile = create(
            :user_con_profile, convention: convention, priv => true
          )
          assert EventPolicy.new(user_con_profile.user, event).read?
        end
      end

      it 'lets people with update_events permission read events' do
        user = create_user_with_update_events_in_event_category(event_category)
        assert EventPolicy.new(user, event).read?
      end

      it 'does not let regular attendees read events' do
        refute EventPolicy.new(rando.user, event).read?
      end

      it 'does not let anonymous users read events' do
        refute EventPolicy.new(nil, event).read?
      end
    end

    describe "when show_event_list is 'priv'" do
      before { convention.update!(show_event_list: 'priv') }

      %w[scheduling gm_liaison staff].each do |priv|
        it "lets #{priv} users read events" do
          user_con_profile = create(
            :user_con_profile, convention: convention, priv => true
          )
          assert EventPolicy.new(user_con_profile.user, event).read?
        end
      end

      it 'lets people with update_events permission read events' do
        user = create_user_with_update_events_in_event_category(event_category)
        assert EventPolicy.new(user, event).read?
      end

      it 'does not let team members read events' do
        team_member = create(:team_member, event: event)
        refute EventPolicy.new(team_member.user_con_profile.user, event).read?
      end

      it 'does not let regular attendees read events' do
        refute EventPolicy.new(rando.user, event).read?
      end

      it 'does not let anonymous users read events' do
        refute EventPolicy.new(nil, event).read?
      end
    end

    describe "when show_event_list is 'no'" do
      before { convention.update!(show_event_list: 'no') }

      it 'lets staff users read events' do
        user_con_profile = create(
          :user_con_profile, convention: convention, staff: true
        )
        assert EventPolicy.new(user_con_profile.user, event).read?
      end

      %w[scheduling gm_liaison staff].each do |priv|
        it "lets #{priv} users read events" do
          user_con_profile = create(
            :user_con_profile, convention: convention, priv => true
          )
          assert EventPolicy.new(user_con_profile.user, event).read?
        end
      end

      it 'lets people with update_events permission read events' do
        user = create_user_with_update_events_in_event_category(event_category)
        assert EventPolicy.new(user, event).read?
      end

      it 'does not let team members read events' do
        team_member = create(:team_member, event: event)
        refute EventPolicy.new(team_member.user_con_profile.user, event).read?
      end

      it 'does not let regular attendees read events' do
        refute EventPolicy.new(rando.user, event).read?
      end

      it 'does not let anonymous users read events' do
        refute EventPolicy.new(nil, event).read?
      end

      it 'lets site_admin users read events' do
        user = create(:user, site_admin: true)
        assert EventPolicy.new(user, event).read?
      end
    end
  end

  [
    %w[read_admin_notes access_admin_notes],
    %w[drop update_events],
    %w[update_admin_notes access_admin_notes]
  ].each do |(action, permission)|
    describe "##{action}?" do
      it "lets people with #{permission} permission #{action}" do
        user = create_user_with_permission_in_event_category(permission, event_category)
        assert EventPolicy.new(user, event).public_send("#{action}?")
      end

      %w[gm_liaison scheduling staff].each do |priv|
        it "lets #{priv} users #{action}" do
          user_con_profile = create(:user_con_profile, convention: convention, priv => priv)
          assert EventPolicy.new(user_con_profile.user, event).public_send("#{action}?")
        end
      end

      it "does not let team members #{action}" do
        team_member = create(:team_member, event: event)
        refute EventPolicy.new(team_member.user_con_profile.user, event).public_send("#{action}?")
      end
    end
  end

  describe '#manage?' do
    it 'does not let anyone manage events' do
      user = create(:user, site_admin: true)
      refute EventPolicy.new(user, event).manage?
    end
  end

  describe '#destroy?' do
    it 'does not let anyone destroy events' do
      user = create(:user, site_admin: true)
      refute EventPolicy.new(user, event).manage?
    end
  end

  describe '#update?' do
    it 'lets people with update_events permission update events' do
      user = create_user_with_update_events_in_event_category(event_category)
      assert EventPolicy.new(user, event).update?
    end

    %w[gm_liaison scheduling staff].each do |priv|
      it "lets #{priv} users update events" do
        user_con_profile = create(:user_con_profile, convention: convention, priv => priv)
        assert EventPolicy.new(user_con_profile.user, event).update?
      end
    end

    it 'lets team members update their own events' do
      team_member = create(:team_member, event: event)
      assert EventPolicy.new(team_member.user_con_profile.user, event).update?
    end

    it 'does not let team members update other events' do
      team_member = create(:team_member, event: create(:event, convention: convention))
      refute EventPolicy.new(team_member.user_con_profile.user, event).update?
    end
  end

  describe 'Scope' do
    before do
      event
      dropped_event
    end

    describe "when show_event_list is 'yes'" do
      before { convention.update!(show_event_list: 'yes') }

      it 'returns all active events to regular users' do
        resolved_events = EventPolicy::Scope.new(nil, Event.all).resolve

        assert_equal [event].sort, resolved_events.sort
      end

      %w[scheduling gm_liaison staff].each do |priv|
        it "returns all events regardless of status to #{priv} users" do
          user_con_profile = create(
            :user_con_profile, convention: convention, priv => true
          )
          resolved_events = EventPolicy::Scope.new(user_con_profile.user, Event.all).resolve

          assert_equal [event, dropped_event].sort, resolved_events.sort
        end
      end
    end

    describe "when show_event_list is 'gms'" do
      before { convention.update!(show_event_list: 'gms') }

      it 'returns active events to team members' do
        team_member = create(:team_member, event: event)
        resolved_events = EventPolicy::Scope.new(
          team_member.user_con_profile.user, Event.all
        ).resolve

        assert_equal [event].sort, resolved_events.sort
      end

      %w[scheduling gm_liaison staff].each do |priv|
        it "returns all events to #{priv} users" do
          user_con_profile = create(
            :user_con_profile, convention: convention, priv => true
          )
          resolved_events = EventPolicy::Scope.new(user_con_profile.user, Event.all).resolve

          assert_equal [event, dropped_event].sort, resolved_events.sort
        end
      end

      it 'returns active events to con_com users' do
        user_con_profile = create(:user_con_profile, convention: convention, con_com: true)
        resolved_events = EventPolicy::Scope.new(user_con_profile.user, Event.all).resolve

        assert_equal [event].sort, resolved_events.sort
      end

      it 'does not return events to regular attendees' do
        user_con_profile = create(:user_con_profile, convention: convention)
        resolved_events = EventPolicy::Scope.new(user_con_profile.user, Event.all).resolve

        assert_equal [], resolved_events.sort
      end

      it 'does not return events to anonymous users' do
        resolved_events = EventPolicy::Scope.new(nil, Event.all).resolve

        assert_equal [], resolved_events.sort
      end
    end

    describe "when show_event_list is 'priv'" do
      before { convention.update!(show_event_list: 'priv') }

      %w[scheduling gm_liaison staff].each do |priv|
        it "returns all events to #{priv} users" do
          user_con_profile = create(
            :user_con_profile, convention: convention, priv => true
          )
          resolved_events = EventPolicy::Scope.new(user_con_profile.user, Event.all).resolve

          assert_equal [event, dropped_event].sort, resolved_events.sort
        end
      end

      it 'returns their own events to team members' do
        team_member = create(:team_member, event: event)
        resolved_events = EventPolicy::Scope.new(team_member.user_con_profile.user, Event.all).resolve

        assert_equal [event], resolved_events.sort
      end

      it 'returns no events to regular attendees' do
        user_con_profile = create(:user_con_profile, convention: convention)
        resolved_events = EventPolicy::Scope.new(user_con_profile.user, Event.all).resolve

        assert_equal [], resolved_events.sort
      end

      it 'returns no events to anonymous users' do
        resolved_events = EventPolicy::Scope.new(nil, Event.all).resolve

        assert_equal [], resolved_events.sort
      end
    end

    describe "when show_event_list is 'no'" do
      before { convention.update!(show_event_list: 'no') }

      %w[scheduling gm_liaison staff].each do |priv|
        it "returns all events to #{priv} users" do
          user_con_profile = create(
            :user_con_profile, convention: convention, priv => true
          )
          resolved_events = EventPolicy::Scope.new(user_con_profile.user, Event.all).resolve

          assert_equal [event, dropped_event].sort, resolved_events.sort
        end
      end

      it 'returns their own events to team members' do
        team_member = create(:team_member, event: event)
        resolved_events = EventPolicy::Scope.new(team_member.user_con_profile.user, Event.all).resolve

        assert_equal [event], resolved_events.sort
      end

      it 'returns no events to regular attendees' do
        user_con_profile = create(:user_con_profile, convention: convention)
        resolved_events = EventPolicy::Scope.new(user_con_profile.user, Event.all).resolve

        assert_equal [], resolved_events.sort
      end

      it 'returns no events to anonymous users' do
        resolved_events = EventPolicy::Scope.new(nil, Event.all).resolve

        assert_equal [], resolved_events.sort
      end

      it 'returns all events to site_admin users' do
        user = create(:user, site_admin: true)
        resolved_events = EventPolicy::Scope.new(user, Event.all).resolve

        assert_equal [event, dropped_event].sort, resolved_events.sort
      end
    end

    it 'returns all events in a single_event convention' do
      dropped_event.destroy!
      convention.update!(site_mode: 'single_event', show_event_list: 'no')
      resolved_events = EventPolicy::Scope.new(nil, Event.all).resolve

      assert_equal [event].sort, resolved_events.sort
    end
  end
end
