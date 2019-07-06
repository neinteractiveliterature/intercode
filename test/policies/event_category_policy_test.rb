require 'test_helper'

class EventCategoryPolicyTest < ActiveSupport::TestCase
  describe '#read?' do
    it 'lets anyone read any event_category' do
      event_category = create(:event_category)
      assert EventCategoryPolicy.new(nil, event_category).read?
    end
  end

  describe '#manage?' do
    it 'lets con staff manage event categories' do
      event_category = create(:event_category)
      user_con_profile = create(
        :staff_user_con_profile,
        convention: event_category.convention
      )
      assert EventCategoryPolicy.new(user_con_profile.user, event_category).manage?
    end

    it 'does not let regular users manage event categories' do
      event_category = create(:event_category)
      user_con_profile = create(:user_con_profile, convention: event_category.convention)
      refute EventCategoryPolicy.new(user_con_profile.user, event_category).manage?
    end
  end

  describe 'Scope' do
    it 'always returns all event categories' do
      create_list(:event_category, 3)
      assert_equal 3, EventCategoryPolicy::Scope.new(nil, EventCategory.all).resolve.count
    end
  end
end
