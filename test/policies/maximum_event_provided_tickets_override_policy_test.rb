require 'test_helper'

class MaximumEventProvidedTicketsOverridePolicyTest < ActiveSupport::TestCase
  let(:event) { FactoryBot.create(:event) }
  let(:convention) { event.convention }
  let(:mepto) { FactoryBot.create(:maximum_event_provided_tickets_override, event: event) }

  describe '#read?' do
    %w[gm_liaison scheduling staff].each do |priv|
      it "lets #{priv} users read MEPTOs" do
        user_con_profile = FactoryBot.create(
          :user_con_profile, convention: convention, priv => true
        )
        assert MaximumEventProvidedTicketsOverridePolicy.new(user_con_profile.user, mepto).read?
      end
    end

    it 'lets users with the override_event_tickets permission read MEPTOs' do
      user_con_profile = FactoryBot.create(:user_con_profile, convention: convention)
      staff_position = FactoryBot.create(
        :staff_position, convention: convention, user_con_profiles: [user_con_profile]
      )
      staff_position.permissions.create!(
        event_category: event.event_category, permission: 'override_event_tickets'
      )
      assert MaximumEventProvidedTicketsOverridePolicy.new(user_con_profile.user, mepto).read?
    end

    it 'lets event team members read MEPTOs' do
      team_member = FactoryBot.create(:team_member, event: event)
      assert MaximumEventProvidedTicketsOverridePolicy.new(team_member.user_con_profile.user, mepto)
        .read?
    end

    it 'does not let regular attendees read MEPTOs' do
      user_con_profile = FactoryBot.create(:user_con_profile, convention: convention)
      refute MaximumEventProvidedTicketsOverridePolicy.new(user_con_profile.user, mepto).read?
    end
  end

  describe '#manage?' do
    %w[gm_liaison scheduling staff].each do |priv|
      it "lets #{priv} users manage MEPTOs" do
        user_con_profile = FactoryBot.create(
          :user_con_profile, convention: convention, priv => true
        )
        assert MaximumEventProvidedTicketsOverridePolicy.new(user_con_profile.user, mepto).manage?
      end
    end

    it 'lets users with the override_event_tickets permission manage MEPTOs' do
      user_con_profile = FactoryBot.create(:user_con_profile, convention: convention)
      staff_position = FactoryBot.create(
        :staff_position, convention: convention, user_con_profiles: [user_con_profile]
      )
      staff_position.permissions.create!(
        event_category: event.event_category, permission: 'override_event_tickets'
      )
      assert MaximumEventProvidedTicketsOverridePolicy.new(user_con_profile.user, mepto).manage?
    end

    it 'does not let event team members manage MEPTOs' do
      team_member = FactoryBot.create(:team_member, event: event)
      refute MaximumEventProvidedTicketsOverridePolicy.new(team_member.user_con_profile.user, mepto)
        .manage?
    end

    it 'does not let regular attendees manage MEPTOs' do
      user_con_profile = FactoryBot.create(:user_con_profile, convention: convention)
      refute MaximumEventProvidedTicketsOverridePolicy.new(user_con_profile.user, mepto).manage?
    end
  end

  describe 'Scope' do
    let(:event_category) { FactoryBot.create(:event_category, convention: convention) }
    let(:events) { FactoryBot.create_list(:event, 3, convention: convention, event_category: event_category) }
    let(:meptos) do
      events.map { |e| FactoryBot.create(:maximum_event_provided_tickets_override, event: e) }
    end

    %w[gm_liaison scheduling staff].each do |priv|
      it "returns all the MEPTOs in a convention for #{priv} users" do
        user_con_profile = FactoryBot.create(
          :user_con_profile, convention: convention, priv => true
        )
        resolved_meptos = MaximumEventProvidedTicketsOverridePolicy::Scope.new(
          user_con_profile.user, MaximumEventProvidedTicketsOverride.all
        ).resolve

        assert_equal meptos.sort, resolved_meptos.sort
      end
    end

    it(
      'returns all the MEPTOs in an event category for users with override_event_tickets permission'
    ) do
      user_con_profile = FactoryBot.create(:user_con_profile, convention: convention)
      staff_position = FactoryBot.create(
        :staff_position, convention: convention, user_con_profiles: [user_con_profile]
      )
      staff_position.permissions.create!(
        event_category: event_category, permission: 'override_event_tickets'
      )
      resolved_meptos = MaximumEventProvidedTicketsOverridePolicy::Scope.new(
        user_con_profile.user, MaximumEventProvidedTicketsOverride.all
      ).resolve

      assert_equal meptos.sort, resolved_meptos.sort
    end

    it 'returns all the MEPTOs for events in which the user is a team member' do
      user_con_profile = FactoryBot.create(:user_con_profile, convention: convention)
      events.each do |event|
        FactoryBot.create(:team_member, event: event, user_con_profile: user_con_profile)
      end

      resolved_meptos = MaximumEventProvidedTicketsOverridePolicy::Scope.new(
        user_con_profile.user, MaximumEventProvidedTicketsOverride.all
      ).resolve

      assert_equal meptos.sort, resolved_meptos.sort
    end

    it 'returns no MEPTOs for regular attendees' do
      meptos
      user_con_profile = FactoryBot.create(:user_con_profile, convention: convention)
      resolved_meptos = MaximumEventProvidedTicketsOverridePolicy::Scope.new(
        user_con_profile.user, MaximumEventProvidedTicketsOverride.all
      ).resolve

      assert_equal [], resolved_meptos.sort
    end
  end
end
