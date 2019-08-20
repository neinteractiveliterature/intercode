require 'test_helper'
require_relative 'convention_permissions_test_helper'

class MaximumEventProvidedTicketsOverridePolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:event) { create(:event) }
  let(:convention) { event.convention }
  let(:mepto) { create(:maximum_event_provided_tickets_override, event: event) }

  describe '#read?' do
    %w[gm_liaison staff].each do |priv|
      it "lets #{priv} users read MEPTOs" do
        user_con_profile = create(
          :user_con_profile, convention: convention, priv => true
        )
        assert MaximumEventProvidedTicketsOverridePolicy.new(user_con_profile.user, mepto).read?
      end
    end

    it 'lets users with the convention-level override_event_tickets permission read MEPTOs' do
      user = create_user_with_override_event_tickets_in_convention(convention)
      assert MaximumEventProvidedTicketsOverridePolicy.new(user, mepto).read?
    end

    it 'lets users with the override_event_tickets permission read MEPTOs' do
      user = create_user_with_override_event_tickets_in_event_category(event.event_category)
      assert MaximumEventProvidedTicketsOverridePolicy.new(user, mepto).read?
    end

    it 'lets event team members read MEPTOs' do
      team_member = create(:team_member, event: event)
      assert MaximumEventProvidedTicketsOverridePolicy.new(team_member.user_con_profile.user, mepto)
        .read?
    end

    it 'does not let regular attendees read MEPTOs' do
      user_con_profile = create(:user_con_profile, convention: convention)
      refute MaximumEventProvidedTicketsOverridePolicy.new(user_con_profile.user, mepto).read?
    end
  end

  describe '#manage?' do
    %w[gm_liaison staff].each do |priv|
      it "lets #{priv} users manage MEPTOs" do
        user_con_profile = create(
          :user_con_profile, convention: convention, priv => true
        )
        assert MaximumEventProvidedTicketsOverridePolicy.new(user_con_profile.user, mepto).manage?
      end
    end

    it 'lets users with the convention-level override_event_tickets permission manage MEPTOs' do
      user = create_user_with_override_event_tickets_in_convention(convention)
      assert MaximumEventProvidedTicketsOverridePolicy.new(user, mepto).manage?
    end

    it 'lets users with the override_event_tickets permission manage MEPTOs' do
      user = create_user_with_override_event_tickets_in_event_category(event.event_category)
      assert MaximumEventProvidedTicketsOverridePolicy.new(user, mepto).manage?
    end

    it 'does not let event team members manage MEPTOs' do
      team_member = create(:team_member, event: event)
      refute MaximumEventProvidedTicketsOverridePolicy.new(team_member.user_con_profile.user, mepto)
        .manage?
    end

    it 'does not let regular attendees manage MEPTOs' do
      user_con_profile = create(:user_con_profile, convention: convention)
      refute MaximumEventProvidedTicketsOverridePolicy.new(user_con_profile.user, mepto).manage?
    end
  end

  describe 'Scope' do
    let(:event_category) { create(:event_category, convention: convention) }
    let(:events) { create_list(:event, 3, convention: convention, event_category: event_category) }
    let(:meptos) do
      events.map { |e| create(:maximum_event_provided_tickets_override, event: e) }
    end

    %w[gm_liaison staff].each do |priv|
      it "returns all the MEPTOs in a convention for #{priv} users" do
        user_con_profile = create(
          :user_con_profile, convention: convention, priv => true
        )
        resolved_meptos = MaximumEventProvidedTicketsOverridePolicy::Scope.new(
          user_con_profile.user, MaximumEventProvidedTicketsOverride.all
        ).resolve

        assert_equal meptos.sort, resolved_meptos.sort
      end
    end

    it(
      'returns all the MEPTOs for users with convention-level override_event_tickets permission'
    ) do
      user = create_user_with_override_event_tickets_in_convention(convention)
      resolved_meptos = MaximumEventProvidedTicketsOverridePolicy::Scope.new(
        user, MaximumEventProvidedTicketsOverride.all
      ).resolve

      assert_equal meptos.sort, resolved_meptos.sort
    end

    it(
      'returns all the MEPTOs in an event category for users with override_event_tickets permission'
    ) do
      user = create_user_with_override_event_tickets_in_event_category(event_category)
      resolved_meptos = MaximumEventProvidedTicketsOverridePolicy::Scope.new(
        user, MaximumEventProvidedTicketsOverride.all
      ).resolve

      assert_equal meptos.sort, resolved_meptos.sort
    end

    it 'returns all the MEPTOs for events in which the user is a team member' do
      user_con_profile = create(:user_con_profile, convention: convention)
      events.each do |event|
        create(:team_member, event: event, user_con_profile: user_con_profile)
      end

      resolved_meptos = MaximumEventProvidedTicketsOverridePolicy::Scope.new(
        user_con_profile.user, MaximumEventProvidedTicketsOverride.all
      ).resolve

      assert_equal meptos.sort, resolved_meptos.sort
    end

    it 'returns no MEPTOs for regular attendees' do
      meptos
      user_con_profile = create(:user_con_profile, convention: convention)
      resolved_meptos = MaximumEventProvidedTicketsOverridePolicy::Scope.new(
        user_con_profile.user, MaximumEventProvidedTicketsOverride.all
      ).resolve

      assert_equal [], resolved_meptos.sort
    end
  end
end
