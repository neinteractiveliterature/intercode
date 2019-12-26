require 'test_helper'

class UserActivityAlertTest < ActiveSupport::TestCase
  describe 'event triggers' do
    it 'triggers on specified events' do
      alert = create(
        :user_activity_alert,
        trigger_on_ticket_create: true,
        trigger_on_user_con_profile_create: true
      )

      assert alert.trigger_on_event?(:ticket_create)
      assert alert.trigger_on_event?(:user_con_profile_create)
    end

    it 'does not trigger if the field for the event is false' do
      alert = create(:user_activity_alert)

      refute alert.trigger_on_event?(:ticket_create)
      refute alert.trigger_on_event?(:user_con_profile_create)
    end

    it 'does not trigger if the event is unknown' do
      alert = create(
        :user_activity_alert,
        trigger_on_ticket_create: true,
        trigger_on_user_con_profile_create: true
      )

      refute alert.trigger_on_event?(:something_random)
    end
  end

  describe 'user matching' do
    let(:bowser) do
      create(
        :user,
        first_name: 'Bowser',
        last_name: 'Koopa',
        email: 'bowser@koopakingdom.com'
      )
    end
    let(:peach) do
      create(
        :user,
        first_name: 'Princess',
        last_name: 'Peach',
        email: 'peach@mushroomkingdom.com'
      )
    end
    let(:user_activity_alert) do
      create(
        :user_activity_alert,
        partial_name: 'bowser',
        email: 'bowser@koopakingdom.com',
        user: bowser
      )
    end
    let(:convention) { user_activity_alert.convention }

    it 'does not match if none of the fields match' do
      refute user_activity_alert.matches?(create_copy_profile(peach, convention))
    end

    it 'matches on partial name' do
      assert user_activity_alert.matches?(create_profile(bowser, convention, copy_name: true))
      assert user_activity_alert.matches?(create_profile(bowser, convention, last_name: 'Bowser'))
      assert user_activity_alert.matches?(create_profile(bowser, convention, nickname: 'Bowser'))
      assert user_activity_alert.matches?(
        create_profile(bowser, convention, last_name: 'Mechabowser')
      )
    end

    describe 'email matching' do
      %w[
        bowser@koopakingdom.com
        b.o.w.s.e.r@koopakingdom.com
        bowser+intercode@koopakingdom.com
        BowSer@koopakingdom.com
      ].each do |email|
        it "matches #{email}" do
          user_activity_alert
          bowser.destroy! # Sorry, but the princess is in another castle
          profile = create_profile(
            create(:user, email: email),
            convention,
            copy_user: true
          )
          assert user_activity_alert.matches?(profile)
        end
      end
    end

    it 'matches on user account' do
      assert user_activity_alert.matches?(create_profile(bowser, convention, copy_user: true))
    end
  end

  describe 'destinations' do
    let(:user_activity_alert) { create(:user_activity_alert) }
    let(:convention) { user_activity_alert.convention }

    it 'figures out the destinations correctly' do
      staff_member = create(:user_con_profile, convention: convention)
      staff_position = create(
        :staff_position,
        convention: convention,
        user_con_profiles: [staff_member]
      )
      other_user_con_profile = create(:user_con_profile, convention: convention)
      user_activity_alert.notification_destinations.create!(staff_position: staff_position)
      user_activity_alert.notification_destinations.create!(user_con_profile: other_user_con_profile)

      assert_equal(
        [staff_member, other_user_con_profile].sort,
        user_activity_alert.destination_user_con_profiles.sort
      )
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
      first_name: copy_name ? user.first_name : 'Benign',
      last_name: copy_name ? user.last_name : 'User',
      **attrs
    )
  end
end
