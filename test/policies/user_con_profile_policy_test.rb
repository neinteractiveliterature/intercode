require 'test_helper'
require_relative 'convention_permissions_test_helper'

class UserConProfilePolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:user_con_profile) { create(:user_con_profile) }
  let(:convention) { user_con_profile.convention }
  let(:event) { create(:event, convention: convention) }
  let(:the_run) { create(:run, event: event) }
  let(:signup) { create(:signup, run: the_run) }
  let(:team_member) { create(:team_member, event: event) }
  let(:staff_profile) { create(:staff_user_con_profile, convention: convention) }
  let(:con_com_profile) { create(:user_con_profile, convention: convention, con_com: true) }
  let(:rando_profile) { create(:user_con_profile, convention: convention) }

  describe '#read?' do
    it 'lets con_com users read profiles' do
      assert UserConProfilePolicy.new(con_com_profile.user, user_con_profile).read?
    end

    it 'lets team members read profiles of anyone in the convention' do
      assert UserConProfilePolicy.new(team_member.user_con_profile.user, user_con_profile).read?
    end

    it 'lets users with read_event_proposals in any event category read profiles' do
      event_category = create(:event_category, convention: convention)
      user = create_user_with_read_event_proposals_in_event_category(event_category)
      assert UserConProfilePolicy.new(user, user_con_profile).read?
    end

    it 'lets users read their own profiles' do
      assert UserConProfilePolicy.new(user_con_profile.user, user_con_profile).read?
    end

    it 'lets users read profiles of team members in the convention' do
      assert UserConProfilePolicy.new(user_con_profile.user, team_member.user_con_profile).read?
    end

    it 'does not let randos read profiles' do
      refute UserConProfilePolicy.new(rando_profile.user, user_con_profile).read?
    end
  end

  describe '#read_email?' do
    it 'lets con_com users read email addresses' do
      assert UserConProfilePolicy.new(con_com_profile.user, user_con_profile).read_email?
    end

    it 'lets team members read emails of anyone in the convention' do
      assert UserConProfilePolicy.new(team_member.user_con_profile.user, user_con_profile)
        .read_email?
    end

    it 'lets users with read_event_proposals in any event category read email addresses' do
      event_category = create(:event_category, convention: convention)
      user = create_user_with_read_event_proposals_in_event_category(event_category)
      assert UserConProfilePolicy.new(user, user_con_profile).read_email?
    end

    it 'lets users read their own email address' do
      assert UserConProfilePolicy.new(user_con_profile.user, user_con_profile).read_email?
    end

    it 'does not let randos read email addresses' do
      refute UserConProfilePolicy.new(rando_profile.user, user_con_profile).read_email?
    end
  end

  describe '#read_personal_info?' do
    it 'lets con_com users read personal info' do
      assert UserConProfilePolicy.new(con_com_profile.user, user_con_profile).read_personal_info?
    end

    it 'lets team members read personal info of attendees in their events' do
      assert UserConProfilePolicy.new(team_member.user_con_profile.user, signup.user_con_profile)
        .read_personal_info?
    end

    it 'does not let team members read personal info of anyone in the convention' do
      refute UserConProfilePolicy.new(team_member.user_con_profile.user, user_con_profile)
        .read_personal_info?
    end

    it 'lets users with read_event_proposals in any event category read personal info' do
      event_category = create(:event_category, convention: convention)
      user = create_user_with_read_event_proposals_in_event_category(event_category)
      assert UserConProfilePolicy.new(user, user_con_profile).read_email?
    end

    it 'lets users read their own personal info' do
      assert UserConProfilePolicy.new(user_con_profile.user, user_con_profile).read_personal_info?
    end

    it 'does not let randos read personal info' do
      refute UserConProfilePolicy.new(rando_profile.user, user_con_profile).read_personal_info?
    end
  end

  %w[create update].each do |action|
    describe "##{action}?" do
      it "lets staff users #{action} other people's profiles" do
        assert UserConProfilePolicy.new(staff_profile.user, user_con_profile)
          .public_send("#{action}?")
      end

      it "does not let con_com users #{action} other people's profiles" do
        refute UserConProfilePolicy.new(con_com_profile.user, user_con_profile)
          .public_send("#{action}?")
      end

      it "lets users #{action} their own profiles" do
        assert UserConProfilePolicy.new(user_con_profile.user, user_con_profile)
          .public_send("#{action}?")
      end

      it "does not let randos #{action} other people's profiles" do
        refute UserConProfilePolicy.new(rando_profile.user, user_con_profile)
          .public_send("#{action}?")
      end
    end
  end

  %w[manage become update_privileges withdraw_all_signups].each do |action|
    describe "##{action}?" do
      it "lets staff users #{action} attendee profiles" do
        assert UserConProfilePolicy.new(staff_profile.user, user_con_profile).withdraw_all_signups?
      end

      it "does not let con_com users #{action} attendee profiles" do
        refute UserConProfilePolicy.new(con_com_profile.user, user_con_profile).withdraw_all_signups?
      end

      it "does not let users #{action} their own profiles" do
        refute UserConProfilePolicy.new(user_con_profile.user, user_con_profile).withdraw_all_signups?
      end

      it "does not let randos #{action} arbitrary profiles" do
        refute UserConProfilePolicy.new(rando_profile.user, user_con_profile).withdraw_all_signups?
      end
    end
  end

  describe 'Scope' do
    # TODO write tests, even though this scope isn't actually used in the code (yet)
  end
end
