require 'test_helper'
require_relative 'convention_permissions_test_helper'

class EventPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

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

      it 'lets people with read_inactive_events permission in convention read dropped events' do
        user = create_user_with_read_inactive_events_in_convention(convention)
        assert EventPolicy.new(user, dropped_event).read?
      end

      it 'lets people with update_events permission in category read dropped events' do
        user = create_user_with_update_events_in_event_category(event_category)
        assert EventPolicy.new(user, dropped_event).read?
      end

      it 'lets people with update_events permission in convention read dropped events' do
        user = create_user_with_update_events_in_convention(convention)
        assert EventPolicy.new(user, dropped_event).read?
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

      it 'lets people with update_events permission in category read events' do
        user = create_user_with_update_events_in_event_category(event_category)
        assert EventPolicy.new(user, event).read?
      end

      %w[
        read_prerelease_schedule
        read_limited_prerelease_schedule
        update_events
      ].each do |permission|
        it "lets people with #{permission} permission in convention read events" do
          user = create_user_with_permission_in_convention(permission, convention)
          assert EventPolicy.new(user, event).read?
        end
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

      it 'lets people with update_events permission read events' do
        user = create_user_with_update_events_in_event_category(event_category)
        assert EventPolicy.new(user, event).read?
      end

      %w[
        read_limited_prerelease_schedule
        update_events
      ].each do |permission|
        it "lets people with #{permission} permission in convention read events" do
          user = create_user_with_permission_in_convention(permission, convention)
          assert EventPolicy.new(user, event).read?
        end
      end

      it 'does not let people with read_prerelease_schedule permission in convention read events' do
        user = create_user_with_read_prerelease_schedule_in_convention(convention)
        refute EventPolicy.new(user, event).read?
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

      it 'lets people with update_events permission read events' do
        user = create_user_with_update_events_in_event_category(event_category)
        assert EventPolicy.new(user, event).read?
      end

      it 'lets people with convention-level update_events permission read events' do
        user = create_user_with_update_events_in_convention(convention)
        assert EventPolicy.new(user, event).read?
      end

      %w[
        read_limited_prerelease_schedule
        read_prerelease_schedule
      ].each do |permission|
        it "does not let people with #{permission} permission in convention read events" do
          user = create_user_with_permission_in_convention(permission, convention)
          refute EventPolicy.new(user, event).read?
        end
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
    %w[create update_events],
    %w[drop update_events],
    %w[restore update_events],
    %w[update_admin_notes access_admin_notes]
  ].each do |(action, permission)|
    describe "##{action}?" do
      it "lets people with #{permission} permission in event category #{action}" do
        user = create_user_with_permission_in_event_category(permission, event_category)
        assert EventPolicy.new(user, event).public_send("#{action}?")
      end

      it "lets people with #{permission} permission in convention #{action}" do
        user = create_user_with_permission_in_convention(permission, convention)
        assert EventPolicy.new(user, event).public_send("#{action}?")
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
    it 'lets people with update_events permission in category update events' do
      user = create_user_with_update_events_in_event_category(event_category)
      assert EventPolicy.new(user, event).update?
    end

    it 'lets people with update_events permission in convention update events' do
      user = create_user_with_update_events_in_convention(convention)
      assert EventPolicy.new(user, event).update?
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

    [
      ['globally', ->() { Event.all }],
      ['inside a convention', ->() { convention.events } ]
    ].each do |(description, scope_generator)|
      let(:event_scope) { instance_exec(&scope_generator) }

      describe(description) do
        describe "when show_event_list is 'yes'" do
          before { convention.update!(show_event_list: 'yes') }

          it 'returns all active events to regular users' do
            resolved_events = EventPolicy::Scope.new(nil, event_scope).resolve

            assert_equal [event].sort, resolved_events.sort
          end

          %w[update_events].each do |permission|
            it "returns all events to users with #{permission} permission in convention" do
              user = create_user_with_permission_in_convention(permission, convention)
              resolved_events = EventPolicy::Scope.new(user, event_scope).resolve

              assert_equal [event, dropped_event].sort, resolved_events.sort
            end
          end
        end

        describe "when show_event_list is 'gms'" do
          before { convention.update!(show_event_list: 'gms') }

          it 'returns active events to team members' do
            team_member = create(:team_member, event: event)
            resolved_events = EventPolicy::Scope.new(
              team_member.user_con_profile.user, event_scope
            ).resolve

            assert_equal [event].sort, resolved_events.sort
          end

          %w[read_prerelease_schedule read_limited_prerelease_schedule].each do |permission|
            it "returns active events to users with #{permission} permission in convention" do
              user = create_user_with_permission_in_convention(permission, convention)
              resolved_events = EventPolicy::Scope.new(user, event_scope).resolve

              assert_equal [event].sort, resolved_events.sort
            end
          end

          %w[update_events].each do |permission|
            it "returns all events to users with #{permission} permission in convention" do
              user = create_user_with_permission_in_convention(permission, convention)
              resolved_events = EventPolicy::Scope.new(user, event_scope).resolve

              assert_equal [event, dropped_event].sort, resolved_events.sort
            end
          end

          it 'does not return events to regular attendees' do
            user_con_profile = create(:user_con_profile, convention: convention)
            resolved_events = EventPolicy::Scope.new(user_con_profile.user, event_scope).resolve

            assert_equal [], resolved_events.sort
          end

          it 'does not return events to anonymous users' do
            resolved_events = EventPolicy::Scope.new(nil, event_scope).resolve

            assert_equal [], resolved_events.sort
          end
        end

        describe "when show_event_list is 'priv'" do
          before { convention.update!(show_event_list: 'priv') }

          %w[read_limited_prerelease_schedule].each do |permission|
            it "returns active events to users with #{permission} permission in convention" do
              user = create_user_with_permission_in_convention(permission, convention)
              resolved_events = EventPolicy::Scope.new(user, event_scope).resolve

              assert_equal [event].sort, resolved_events.sort
            end
          end

          %w[read_prerelease_schedule].each do |permission|
            it "returns no events to users with #{permission} permission in convention" do
              user = create_user_with_permission_in_convention(permission, convention)
              resolved_events = EventPolicy::Scope.new(user, event_scope).resolve

              assert_equal [].sort, resolved_events.sort
            end
          end

          %w[update_events].each do |permission|
            it "returns all events to users with #{permission} permission in convention" do
              user = create_user_with_permission_in_convention(permission, convention)
              resolved_events = EventPolicy::Scope.new(user, event_scope).resolve

              assert_equal [event, dropped_event].sort, resolved_events.sort
            end
          end

          it 'returns their own events to team members' do
            team_member = create(:team_member, event: event)
            resolved_events = EventPolicy::Scope.new(team_member.user_con_profile.user, event_scope).resolve

            assert_equal [event], resolved_events.sort
          end

          it 'returns no events to regular attendees' do
            user_con_profile = create(:user_con_profile, convention: convention)
            resolved_events = EventPolicy::Scope.new(user_con_profile.user, event_scope).resolve

            assert_equal [], resolved_events.sort
          end

          it 'returns no events to anonymous users' do
            resolved_events = EventPolicy::Scope.new(nil, event_scope).resolve

            assert_equal [], resolved_events.sort
          end
        end

        describe "when show_event_list is 'no'" do
          before { convention.update!(show_event_list: 'no') }

          it 'returns their own events to team members' do
            team_member = create(:team_member, event: event)
            resolved_events = EventPolicy::Scope.new(team_member.user_con_profile.user, event_scope).resolve

            assert_equal [event], resolved_events.sort
          end

          %w[read_limited_prerelease_schedule read_prerelease_schedule].each do |permission|
            it "returns no events to users with #{permission} permission in convention" do
              user = create_user_with_permission_in_convention(permission, convention)
              resolved_events = EventPolicy::Scope.new(user, event_scope).resolve

              assert_equal [].sort, resolved_events.sort
            end
          end

          %w[update_events].each do |permission|
            it "returns all events to users with #{permission} permission in convention" do
              user = create_user_with_permission_in_convention(permission, convention)
              resolved_events = EventPolicy::Scope.new(user, event_scope).resolve

              assert_equal [event, dropped_event].sort, resolved_events.sort
            end
          end

          it 'returns no events to regular attendees' do
            user_con_profile = create(:user_con_profile, convention: convention)
            resolved_events = EventPolicy::Scope.new(user_con_profile.user, event_scope).resolve

            assert_equal [], resolved_events.sort
          end

          it 'returns no events to anonymous users' do
            resolved_events = EventPolicy::Scope.new(nil, event_scope).resolve

            assert_equal [], resolved_events.sort
          end

          it 'returns all events to site_admin users' do
            user = create(:user, site_admin: true)
            resolved_events = EventPolicy::Scope.new(user, event_scope).resolve

            assert_equal [event, dropped_event].sort, resolved_events.sort
          end
        end

        it 'returns all events in a single_event convention' do
          dropped_event.destroy!
          convention.update!(site_mode: 'single_event', show_event_list: 'no')
          resolved_events = EventPolicy::Scope.new(nil, event_scope).resolve

          assert_equal [event].sort, resolved_events.sort
        end
      end
    end
  end
end
