require 'test_helper'
require_relative 'convention_permissions_test_helper'

class RunPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:the_run) { create(:run) }
  let(:event) { the_run.event }
  let(:convention) { event.convention }

  describe '#read?' do
    describe "when show_schedule is 'yes'" do
      before { convention.update!(show_schedule: 'yes') }

      it 'lets anyone read' do
        assert RunPolicy.new(nil, the_run).read?
      end
    end

    describe "when show_schedule is 'gms'" do
      before { convention.update!(show_schedule: 'gms') }

      it 'lets team members read' do
        event = create(:event, convention: convention)
        team_member = create(:team_member, event: event)
        assert_policy_allows RunPolicy, team_member.user_con_profile.user, the_run, :read?, convention
      end

      %w[read_prerelease_schedule read_limited_prerelease_schedule update_events].each do |permission|
        it "lets people with #{permission} permission in convention read runs" do
          user = create_user_with_permission_in_convention(permission, convention)
          assert_policy_allows RunPolicy, user, the_run, :read?, convention
        end
      end

      it 'does not let regular attendees read' do
        user_con_profile = create(:user_con_profile, convention: convention)
        refute RunPolicy.new(user_con_profile.user, the_run).read?
      end

      it 'does not let anonymous users read' do
        refute RunPolicy.new(nil, the_run).read?
      end
    end

    describe "when show_schedule is 'priv'" do
      before { convention.update!(show_schedule: 'priv') }

      %w[read_limited_prerelease_schedule update_events].each do |permission|
        it "lets people with #{permission} permission in convention read runs" do
          user = create_user_with_permission_in_convention(permission, convention)
          assert_policy_allows RunPolicy, user, the_run, :read?, convention
        end
      end

      %w[read_prerelease_schedule].each do |permission|
        it "does not let people with #{permission} permission in convention read runs" do
          user = create_user_with_permission_in_convention(permission, convention)
          refute RunPolicy.new(user, the_run).read?
        end
      end

      it 'does not let team members read' do
        event = create(:event, convention: convention)
        team_member = create(:team_member, event: event)
        refute RunPolicy.new(team_member.user_con_profile.user, the_run).read?
      end

      it 'does not let regular attendees read' do
        user_con_profile = create(:user_con_profile, convention: convention)
        refute RunPolicy.new(user_con_profile.user, the_run).read?
      end

      it 'does not let anonymous users read' do
        refute RunPolicy.new(nil, the_run).read?
      end
    end

    describe "when show_schedule is 'no'" do
      before { convention.update!(show_schedule: 'no') }

      %w[update_events].each do |permission|
        it "lets people with #{permission} permission in convention read runs" do
          user = create_user_with_permission_in_convention(permission, convention)
          assert_policy_allows RunPolicy, user, the_run, :read?, convention
        end
      end

      %w[read_schedule read_prerelease_schedule].each do |permission|
        it "does not let people with #{permission} permission in convention read runs" do
          user = create_user_with_permission_in_convention(permission, convention)
          refute RunPolicy.new(user, the_run).read?
        end
      end

      it 'does not let team members read' do
        event = create(:event, convention: convention)
        team_member = create(:team_member, event: event)
        refute RunPolicy.new(team_member.user_con_profile.user, the_run).read?
      end

      it 'does not let regular attendees read' do
        user_con_profile = create(:user_con_profile, convention: convention)
        refute RunPolicy.new(user_con_profile.user, the_run).read?
      end

      it 'does not let anonymous users read' do
        refute RunPolicy.new(nil, the_run).read?
      end

      it 'lets site_admin users read' do
        user = create(:user, site_admin: true)
        assert RunPolicy.new(user, the_run).read?
      end
    end

    it 'lets anyone read runs in a single_event convention' do
      convention.update!(site_mode: 'single_event', show_schedule: 'no')
      assert RunPolicy.new(nil, the_run).read?
    end
  end

  describe '#signup_summary?' do
    it 'lets users read signup summaries of runs they are signed up for' do
      signup = create(:signup, run: the_run)
      assert_policy_allows RunPolicy, signup.user_con_profile.user, the_run, :signup_summary?, convention
    end

    it 'hides signup summaries if private_signup_list is true' do
      event.update!(private_signup_list: true)
      signup = create(:signup, run: the_run)
      refute RunPolicy.new(signup.user_con_profile.user, the_run).signup_summary?
    end
  end

  describe '#manage?' do
    it 'lets users with update_runs manage runs' do
      user = create_user_with_update_runs_in_convention(convention)
      assert_policy_allows RunPolicy, user, the_run, :manage?, convention
    end

    it 'does not let team members manage runs' do
      team_member = create(:team_member, event: event)
      refute RunPolicy.new(team_member.user_con_profile.user, the_run).manage?
    end

    it 'does not let regular users manage runs' do
      user_con_profile = create(:user_con_profile, convention: convention)
      refute RunPolicy.new(user_con_profile.user, the_run).manage?
    end
  end

  describe 'Scope' do
    describe "when show_schedule is 'yes'" do
      before { convention.update!(show_schedule: 'yes') }

      it 'returns all runs' do
        resolved_runs = RunPolicy::Scope.new(nil, Run.all).resolve

        assert_equal [the_run].sort, resolved_runs.sort
      end
    end

    describe "when show_schedule is 'gms'" do
      before { convention.update!(show_schedule: 'gms') }

      it 'returns all runs to team members' do
        event = create(:event, convention: convention)
        team_member = create(:team_member, event: event)
        resolved_runs = RunPolicy::Scope.new(team_member.user_con_profile.user, Run.all).resolve
        identity_assumer_resolved_runs =
          RunPolicy::Scope.new(
            create_identity_assumer_from_other_convention(team_member.user_con_profile.user),
            Run.all
          ).resolve

        assert_equal [the_run].sort, resolved_runs.sort
        assert_equal [].sort, identity_assumer_resolved_runs.sort
      end

      %w[read_prerelease_schedule read_limited_prerelease_schedule update_events].each do |permission|
        it "returns all runs to users with #{permission} permission in convention" do
          user = create_user_with_permission_in_convention(permission, convention)
          resolved_runs = RunPolicy::Scope.new(user, Run.all).resolve
          identity_assumer_resolved_runs =
            RunPolicy::Scope.new(create_identity_assumer_from_other_convention(user), Run.all).resolve

          assert_equal [the_run].sort, resolved_runs.sort
          assert_equal [].sort, identity_assumer_resolved_runs.sort
        end
      end

      it 'does not return runs to regular attendees' do
        user_con_profile = create(:user_con_profile, convention: convention)
        resolved_runs = RunPolicy::Scope.new(user_con_profile.user, Run.all).resolve

        assert_equal [], resolved_runs.sort
      end

      it 'does not return runs to anonymous users' do
        resolved_runs = RunPolicy::Scope.new(nil, Run.all).resolve

        assert_equal [], resolved_runs.sort
      end
    end

    describe "when show_schedule is 'priv'" do
      before { convention.update!(show_schedule: 'priv') }

      %w[read_limited_prerelease_schedule update_events].each do |permission|
        it "returns all runs to users with #{permission} permission in convention" do
          user = create_user_with_permission_in_convention(permission, convention)
          resolved_runs = RunPolicy::Scope.new(user, Run.all).resolve
          identity_assumer_resolved_runs =
            RunPolicy::Scope.new(create_identity_assumer_from_other_convention(user), Run.all).resolve

          assert_equal [the_run].sort, resolved_runs.sort
          assert_equal [].sort, identity_assumer_resolved_runs.sort
        end
      end

      %w[read_prerelease_schedule].each do |permission|
        it "returns no runs to users with #{permission} permission in convention" do
          user = create_user_with_permission_in_convention(permission, convention)
          resolved_runs = RunPolicy::Scope.new(user, Run.all).resolve

          assert_equal [].sort, resolved_runs.sort
        end
      end

      it 'returns no runs to team members' do
        event = create(:event, convention: convention)
        team_member = create(:team_member, event: event)
        resolved_runs = RunPolicy::Scope.new(team_member.user_con_profile.user, Run.all).resolve

        assert_equal [], resolved_runs.sort
      end

      it 'returns no runs to regular attendees' do
        user_con_profile = create(:user_con_profile, convention: convention)
        resolved_runs = RunPolicy::Scope.new(user_con_profile.user, Run.all).resolve

        assert_equal [], resolved_runs.sort
      end

      it 'returns no runs to anonymous users' do
        resolved_runs = RunPolicy::Scope.new(nil, Run.all).resolve

        assert_equal [], resolved_runs.sort
      end
    end

    describe "when show_schedule is 'no'" do
      before { convention.update!(show_schedule: 'no') }

      %w[update_events].each do |permission|
        it "returns all runs to users with #{permission} permission in convention" do
          user = create_user_with_permission_in_convention(permission, convention)
          resolved_runs = RunPolicy::Scope.new(user, Run.all).resolve
          identity_assumer_resolved_runs =
            RunPolicy::Scope.new(create_identity_assumer_from_other_convention(user), Run.all).resolve

          assert_equal [the_run].sort, resolved_runs.sort
          assert_equal [].sort, identity_assumer_resolved_runs.sort
        end
      end

      %w[read_prerelease_schedule read_limited_prerelease_schedule].each do |permission|
        it "returns no runs to users with #{permission} permission in convention" do
          user = create_user_with_permission_in_convention(permission, convention)
          resolved_runs = RunPolicy::Scope.new(user, Run.all).resolve

          assert_equal [].sort, resolved_runs.sort
        end
      end

      it 'returns no runs to team members' do
        event = create(:event, convention: convention)
        team_member = create(:team_member, event: event)
        resolved_runs = RunPolicy::Scope.new(team_member.user_con_profile.user, Run.all).resolve

        assert_equal [], resolved_runs.sort
      end

      it 'returns no runs to regular attendees' do
        user_con_profile = create(:user_con_profile, convention: convention)
        resolved_runs = RunPolicy::Scope.new(user_con_profile.user, Run.all).resolve

        assert_equal [], resolved_runs.sort
      end

      it 'returns no runs to anonymous users' do
        resolved_runs = RunPolicy::Scope.new(nil, Run.all).resolve

        assert_equal [], resolved_runs.sort
      end

      it 'returns all runs to site_admin users' do
        user = create(:user, site_admin: true)
        resolved_runs = RunPolicy::Scope.new(user, Run.all).resolve

        assert_equal [the_run].sort, resolved_runs.sort
      end
    end

    it 'returns all runs in a single_event convention' do
      convention.update!(site_mode: 'single_event', show_schedule: 'no')
      resolved_runs = RunPolicy::Scope.new(nil, Run.all).resolve

      assert_equal [the_run].sort, resolved_runs.sort
    end
  end
end
