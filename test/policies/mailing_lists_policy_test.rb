require 'test_helper'
require_relative 'convention_permissions_test_helper'

class MailingListsPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention) }
  let(:mailing_lists_presenter) { MailingListsPresenter.new(convention) }

  MAIL_PERMISSION_NAMES = %w[read_team_members_mailing_list read_user_con_profiles_mailing_list]

  MAIL_PERMISSION_NAMES.each do |permission_name|
    describe "users with #{permission_name}" do
      let(:user) do
        create_user_with_permission_in_convention(permission_name, convention)
      end
      let(:policy) { MailingListsPolicy.new(user, mailing_lists_presenter) }

      it "lets #{permission_name} users read_any_mailing_list" do
        assert policy.read_any_mailing_list?
      end

      it "lets #{permission_name} users #{permission_name}" do
        assert policy.public_send("#{permission_name}?")
      end

      (MAIL_PERMISSION_NAMES - [permission_name]).each do |other_permission_name|
        it "does not let #{permission_name} users #{other_permission_name}" do
          refute policy.public_send("#{other_permission_name}?")
        end
      end
    end
  end

  describe 'regular attendees' do
    let(:user_con_profile) { create(:user_con_profile, convention: convention) }
    let(:policy) { MailingListsPolicy.new(user_con_profile.user, mailing_lists_presenter) }

    MAIL_PERMISSION_NAMES.each do |permission_name|
      it "does not let regular attendees #{permission_name}" do
        refute policy.public_send("#{permission_name}?")
      end
    end

    it 'does not let regular attendees read_any_mailing_list' do
      refute policy.read_any_mailing_list?
    end
  end
end
