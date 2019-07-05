require 'test_helper'

class MailingListsPolicyTest < ActiveSupport::TestCase
  let(:convention) { FactoryBot.create(:convention) }
  let(:mailing_lists_presenter) { MailingListsPresenter.new(convention) }

  UserConProfile::MAIL_PRIV_NAMES.each do |priv_name|
    describe "users with #{priv_name}" do
      let(:user_con_profile) do
        FactoryBot.create(:user_con_profile, convention: convention, priv_name => true)
      end
      let(:policy) { MailingListsPolicy.new(user_con_profile.user, mailing_lists_presenter) }

      it "lets #{priv_name} users mail_to_any" do
        assert policy.mail_to_any?
      end

      it "lets #{priv_name} users #{priv_name}" do
        assert policy.public_send("#{priv_name}?")
      end

      (UserConProfile::MAIL_PRIV_NAMES - [priv_name]).each do |other_priv_name|
        it "does not let #{priv_name} users #{other_priv_name}" do
          refute policy.public_send("#{other_priv_name}?")
        end
      end
    end
  end

  describe 'regular attendees' do
    let(:user_con_profile) { FactoryBot.create(:user_con_profile, convention: convention) }
    let(:policy) { MailingListsPolicy.new(user_con_profile.user, mailing_lists_presenter) }

    UserConProfile::MAIL_PRIV_NAMES.each do |priv_name|
      it "does not let regular attendees #{priv_name}" do
        refute policy.public_send("#{priv_name}?")
      end
    end

    it 'does not let regular attendees mail_to_any' do
      refute policy.mail_to_any?
    end
  end
end
