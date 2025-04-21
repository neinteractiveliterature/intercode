# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: user_activity_alerts
#
#  id                                 :bigint           not null, primary key
#  email                              :text
#  partial_name                       :text
#  trigger_on_ticket_create           :boolean          default(FALSE), not null
#  trigger_on_user_con_profile_create :boolean          default(FALSE), not null
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#  convention_id                      :bigint           not null
#  user_id                            :bigint
#
# Indexes
#
#  index_user_activity_alerts_on_convention_id  (convention_id)
#  index_user_activity_alerts_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (user_id => users.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class UserActivityAlertTest < ActiveSupport::TestCase
  describe "event triggers" do
    it "triggers on specified events" do
      alert = create(:user_activity_alert, trigger_on_ticket_create: true, trigger_on_user_con_profile_create: true)

      assert alert.trigger_on_event?(:ticket_create)
      assert alert.trigger_on_event?(:user_con_profile_create)
    end

    it "does not trigger if the field for the event is false" do
      alert = create(:user_activity_alert)

      refute alert.trigger_on_event?(:ticket_create)
      refute alert.trigger_on_event?(:user_con_profile_create)
    end

    it "does not trigger if the event is unknown" do
      alert = create(:user_activity_alert, trigger_on_ticket_create: true, trigger_on_user_con_profile_create: true)

      refute alert.trigger_on_event?(:something_random)
    end
  end

  describe "with no filters" do
    let(:alert) { create(:user_activity_alert) }
    let(:convention) { alert.convention }

    it "matches any user" do
      user = create(:user)
      assert alert.matches?(create_profile(user, convention))
    end
  end

  describe "user matching" do
    let(:bowser) { create(:user, first_name: "Bowser", last_name: "Koopa", email: "bowser@koopakingdom.com") }
    let(:peach) { create(:user, first_name: "Princess", last_name: "Peach", email: "peach@mushroomkingdom.com") }
    let(:user_activity_alert) do
      create(:user_activity_alert, partial_name: "bowser", email: "bowser@koopakingdom.com", user: bowser)
    end
    let(:convention) { user_activity_alert.convention }

    it "does not match if none of the fields match" do
      refute user_activity_alert.matches?(create_copy_profile(peach, convention))
    end

    it "matches on partial name" do
      assert user_activity_alert.matches?(create_profile(bowser, convention, copy_name: true))
      assert user_activity_alert.matches?(create_profile(bowser, convention, last_name: "Bowser"))
      assert user_activity_alert.matches?(create_profile(bowser, convention, nickname: "Bowser"))
      assert user_activity_alert.matches?(create_profile(bowser, convention, last_name: "Mechabowser"))
    end

    describe "email matching" do
      %w[
        bowser@koopakingdom.com
        b.o.w.s.e.r@koopakingdom.com
        bowser+intercode@koopakingdom.com
        BowSer@koopakingdom.com
      ].each do |email|
        it "matches #{email}" do
          user_activity_alert
          bowser.destroy! # Sorry, but the princess is in another castle
          profile = create_profile(create(:user, email: email), convention, copy_user: true)
          assert user_activity_alert.matches?(profile)
        end
      end
    end

    it "matches on user account" do
      assert user_activity_alert.matches?(create_profile(bowser, convention, copy_user: true))
    end
  end

  private

  def create_copy_profile(user, convention, **attrs)
    create_profile(user, convention, copy_user: true, copy_name: true, **attrs)
  end

  def create_profile(user, convention, copy_user: false, copy_name: false, **attrs)
    create(
      :user_con_profile,
      convention: convention,
      user: copy_user ? user : create(:user),
      first_name: copy_name ? user.first_name : "Benign",
      last_name: copy_name ? user.last_name : "User",
      **attrs
    )
  end
end
