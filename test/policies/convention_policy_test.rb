require 'test_helper'
require_relative 'convention_permissions_test_helper'

class ConventionPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention) }

  describe '#read' do
    it 'lets anyone read any convention' do
      assert ConventionPolicy.new(nil, convention).read?
    end
  end

  [%w[schedule show_schedule], %w[list_events show_event_list]].each do |(action, field)|
    let(:convention) { create(:convention, show_schedule: 'no', show_event_list: 'yes') }

    describe "##{action}?" do
      describe "when #{field} is 'yes'" do
        before { convention.update!(field => 'yes') }

        it "lets anyone #{action}" do
          assert ConventionPolicy.new(nil, convention).public_send("#{action}?")
        end
      end

      describe "when #{field} is 'gms'" do
        before { convention.update!(field => 'gms') }

        it "lets team members #{action}" do
          event = create(:event, convention: convention)
          team_member = create(:team_member, event: event)
          assert ConventionPolicy.new(team_member.user_con_profile.user, convention)
            .public_send("#{action}?")
        end

        %w[
          read_prerelease_schedule read_limited_prerelease_schedule update_events
        ].each do |permission|
          it "lets users with #{permission} permission in convention #{action}" do
            user = create_user_with_permission_in_convention(permission, convention)
            assert ConventionPolicy.new(user, convention).public_send("#{action}?")
          end
        end

        it "does not let regular attendees #{action}" do
          user_con_profile = create(:user_con_profile, convention: convention)
          refute ConventionPolicy.new(user_con_profile.user, convention).public_send("#{action}?")
        end

        it "does not let anonymous users #{action}" do
          refute ConventionPolicy.new(nil, convention).public_send("#{action}?")
        end
      end

      describe "when #{field} is 'priv'" do
        before { convention.update!(field => 'priv') }

        %w[read_limited_prerelease_schedule update_events].each do |permission|
          it "lets users with #{permission} permission in convention #{action}" do
            user = create_user_with_permission_in_convention(permission, convention)
            assert ConventionPolicy.new(user, convention).public_send("#{action}?")
          end
        end

        %w[read_prerelease_schedule].each do |permission|
          it "does not let users with #{permission} permission in convention #{action}" do
            user = create_user_with_permission_in_convention(permission, convention)
            refute ConventionPolicy.new(user, convention).public_send("#{action}?")
          end
        end

        it "does not let team members #{action}" do
          event = create(:event, convention: convention)
          team_member = create(:team_member, event: event)
          refute ConventionPolicy.new(team_member.user_con_profile.user, convention)
            .public_send("#{action}?")
        end

        it "does not let regular attendees #{action}" do
          user_con_profile = create(:user_con_profile, convention: convention)
          refute ConventionPolicy.new(user_con_profile.user, convention).public_send("#{action}?")
        end

        it "does not let anonymous users #{action}" do
          refute ConventionPolicy.new(nil, convention).public_send("#{action}?")
        end
      end

      describe "when #{field} is 'no'" do
        before { convention.update!(field => 'no') }

        %w[update_events].each do |permission|
          it "lets users with #{permission} permission in convention #{action}" do
            user = create_user_with_permission_in_convention(permission, convention)
            assert ConventionPolicy.new(user, convention).public_send("#{action}?")
          end
        end

        %w[read_limited_prerelease_schedule read_prerelease_schedule].each do |permission|
          it "does not let users with #{permission} permission in convention #{action}" do
            user = create_user_with_permission_in_convention(permission, convention)
            refute ConventionPolicy.new(user, convention).public_send("#{action}?")
          end
        end

        it "does not let team members #{action}" do
          event = create(:event, convention: convention)
          team_member = create(:team_member, event: event)
          refute ConventionPolicy.new(team_member.user_con_profile.user, convention)
            .public_send("#{action}?")
        end

        it "does not let regular attendees #{action}" do
          user_con_profile = create(:user_con_profile, convention: convention)
          refute ConventionPolicy.new(user_con_profile.user, convention).public_send("#{action}?")
        end

        it "does not let anonymous users #{action}" do
          refute ConventionPolicy.new(nil, convention).public_send("#{action}?")
        end

        it "lets site_admin users #{action}" do
          user = create(:user, site_admin: true)
          assert ConventionPolicy.new(user, convention).public_send("#{action}?")
        end
      end
    end
  end

  describe '#schedule_with_counts?' do
    %w[no priv gms yes].each do |value|
      {
        'update_events' => %w[no priv gms yes],
        'read_limited_prerelease_schedule' => %w[priv gms yes],
        'read_prerelease_schedule' => %w[gms yes]
      }.each do |permission, allowed_show_schedule_values|
        describe "when show_schedule is #{value}" do
          let(:convention) { create(:convention, show_schedule: value) }

          allowed = allowed_show_schedule_values.include?(value)
          verb = (allowed ? 'lets' : 'does not let')

          it "#{verb} users with #{permission} in convention schedule_with_counts" do
            convention.update!(show_schedule: value)
            user = create_user_with_permissions_in_convention(
              [permission, 'read_schedule_with_counts'], convention
            )
            policy_result = ConventionPolicy.new(user, convention).schedule_with_counts?

            if allowed
              assert policy_result
            else
              refute policy_result
            end

            user_without_counts = create_user_with_permission_in_convention(permission, convention)
            refute ConventionPolicy.new(user_without_counts, convention).schedule_with_counts?
          end

          it 'does not let regular attendees schedule_with_counts' do
            user_con_profile = create(:user_con_profile, convention: convention)
            refute ConventionPolicy.new(user_con_profile.user, convention).schedule_with_counts?
          end

          it 'does not let anonymous users schedule_with_counts' do
            refute ConventionPolicy.new(nil, convention).schedule_with_counts?
          end

          it 'does not let team members schedule_with_counts' do
            event = create(:event, convention: convention)
            team_member = create(:team_member, event: event)
            refute ConventionPolicy.new(team_member.user_con_profile.user, convention)
              .schedule_with_counts?
          end
        end
      end
    end
  end

  %w[view_reports view_attendees].each do |action|
    describe "##{action}?" do
      it "does not let regular attendees #{action}" do
        user_con_profile = create(:user_con_profile, convention: convention)
        refute ConventionPolicy.new(user_con_profile.user, convention).public_send("#{action}?")
      end
    end
  end

  describe '#view_reports?' do
    it 'lets users with the read_reports permission view reports' do
      user = create_user_with_read_reports_in_convention(convention)
      assert ConventionPolicy.new(user, convention).view_reports?
    end
  end

  describe '#view_event_proposals?' do
    it 'lets users with a read_event_proposals permission in this convention view proposals' do
      event_category = create(:event_category, convention: convention)
      user_con_profile = create(:user_con_profile, convention: convention)
      staff_position = create(
        :staff_position, convention: convention, user_con_profiles: [user_con_profile]
      )
      staff_position.permissions.create!(
        event_category: event_category, permission: 'read_event_proposals'
      )
      assert ConventionPolicy.new(user_con_profile.user, convention).view_event_proposals?
    end

    it 'lets users with convention-level read_event_proposals permission view proposals' do
      user = create_user_with_read_event_proposals_in_convention(convention)
      assert ConventionPolicy.new(user, convention).view_event_proposals?
    end

    it 'lets users with a read_event_proposals permission in this convention view proposals' do
      event_category = create(:event_category, convention: convention)
      user = create_user_with_read_event_proposals_in_event_category(event_category)
      assert ConventionPolicy.new(user, convention).view_event_proposals?
    end

    it 'does not let regular attendees view event proposals' do
      user_con_profile = create(:user_con_profile, convention: convention)
      refute ConventionPolicy.new(user_con_profile.user, convention).view_event_proposals?
    end
  end

  describe '#update?' do
    it 'lets users with update_convention update' do
      user = create_user_with_update_convention_in_convention(convention)
      assert ConventionPolicy.new(user, convention).update?
    end

    it 'does not let regular attendees update' do
      user_con_profile = create(:user_con_profile, convention: convention)
      refute ConventionPolicy.new(user_con_profile.user, convention).update?
    end
  end

  describe 'Scope' do
    it 'lets anyone read any convention' do
      conventions = create_list(:convention, 3)
      resolved_records = ConventionPolicy::Scope.new(nil, Convention.all).resolve.to_a

      assert_equal conventions.sort, resolved_records.sort
    end
  end
end
