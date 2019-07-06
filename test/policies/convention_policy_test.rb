require 'test_helper'

class ConventionPolicyTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }

  describe '#read' do
    it 'lets anyone read any convention' do
      assert ConventionPolicy.new(nil, convention).read?
    end
  end

  [%w[schedule show_schedule], %w[list_events show_event_list]].each do |(action, field)|
    describe "##{action}?" do
      describe "when #{field} is 'yes'" do
        it "lets anyone #{action}" do
          convention = create(:convention, field => 'yes')
          assert ConventionPolicy.new(nil, convention).public_send("#{action}?")
        end
      end

      describe "when #{field} is 'gms'" do
        let(:convention) { create(:convention, field => 'gms') }

        it "lets team members #{action}" do
          event = create(:event, convention: convention)
          team_member = create(:team_member, event: event)
          assert ConventionPolicy.new(team_member.user_con_profile.user, convention)
            .public_send("#{action}?")
        end

        %w[con_com scheduling gm_liaison staff].each do |priv|
          it "lets #{priv} users #{action}" do
            user_con_profile = create(
              :user_con_profile, convention: convention, priv => true
            )
            assert ConventionPolicy.new(user_con_profile.user, convention).public_send("#{action}?")
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
        let(:convention) { create(:convention, field => 'priv') }

        %w[scheduling gm_liaison staff].each do |priv|
          it "lets #{priv} users #{action}" do
            user_con_profile = create(
              :user_con_profile, convention: convention, priv => true
            )
            assert ConventionPolicy.new(user_con_profile.user, convention).public_send("#{action}?")
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
        let(:convention) { create(:convention, field => 'no') }

        it "does not let staff users #{action}" do
          user_con_profile = create(
            :user_con_profile, convention: convention, staff: true
          )
          refute ConventionPolicy.new(user_con_profile.user, convention).public_send("#{action}?")
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
    %w[priv gms yes no].each do |value|
      describe "when show_schedule is '#{value}'" do
        let(:convention) { create(:convention, show_schedule: value) }

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

    %w[scheduling gm_liaison staff].each do |priv|
      %w[priv gms yes].each do |value|
        describe "when show_schedule is '#{value}'" do
          let(:convention) { create(:convention, show_schedule: value) }

          it "lets #{priv} users schedule_with_counts" do
            user_con_profile = create(
              :user_con_profile, convention: convention, priv => true
            )
            assert ConventionPolicy.new(user_con_profile.user, convention).schedule_with_counts?
          end
        end
      end

      %w[no].each do |value|
        describe "when show_schedule is '#{value}'" do
          let(:convention) { create(:convention, show_schedule: value) }

          it "does not let #{priv} users schedule_with_counts" do
            user_con_profile = create(
              :user_con_profile, convention: convention, priv => true
            )
            refute ConventionPolicy.new(user_con_profile.user, convention).schedule_with_counts?
          end
        end
      end
    end

    %w[con_com].each do |priv|
      %w[gms yes].each do |value|
        describe "when show_schedule is '#{value}'" do
          let(:convention) { create(:convention, show_schedule: value) }

          it "lets #{priv} users schedule_with_counts" do
            user_con_profile = create(
              :user_con_profile, convention: convention, priv => true
            )
            assert ConventionPolicy.new(user_con_profile.user, convention).schedule_with_counts?
          end
        end
      end

      %w[priv no].each do |value|
        describe "when show_schedule is '#{value}'" do
          let(:convention) { create(:convention, show_schedule: value) }

          it "does not let #{priv} users schedule_with_counts" do
            user_con_profile = create(
              :user_con_profile, convention: convention, priv => true
            )
            refute ConventionPolicy.new(user_con_profile.user, convention).schedule_with_counts?
          end
        end
      end
    end
  end

  %w[view_reports view_attendees].each do |action|
    describe "##{action}?" do
      it "lets con_com users #{action}" do
        user_con_profile = create(
          :user_con_profile, convention: convention, con_com: true
        )
        assert ConventionPolicy.new(user_con_profile.user, convention).public_send("#{action}?")
      end

      it "does not let regular attendees #{action}" do
        user_con_profile = create(:user_con_profile, convention: convention)
        refute ConventionPolicy.new(user_con_profile.user, convention).public_send("#{action}?")
      end
    end
  end

  describe '#view_event_proposals?' do
    it 'lets gm_liaison users view event proposals' do
      user_con_profile = create(
        :user_con_profile, convention: convention, gm_liaison: true
      )
      assert ConventionPolicy.new(user_con_profile.user, convention).view_event_proposals?
    end

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

    it 'does not let regular attendees view event proposals' do
      user_con_profile = create(:user_con_profile, convention: convention)
      refute ConventionPolicy.new(user_con_profile.user, convention).view_event_proposals?
    end
  end

  describe '#update?' do
    it 'lets staff users update' do
      user_con_profile = create(:user_con_profile, convention: convention, staff: true)
      assert ConventionPolicy.new(user_con_profile.user, convention).update?
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
