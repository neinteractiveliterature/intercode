require 'test_helper'
require_relative 'convention_permissions_test_helper'

class StaffPositionPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  describe '#read?' do
    it 'lets anyone read any staff position' do
      staff_position = create(:staff_position)
      assert StaffPositionPolicy.new(nil, staff_position).read?
    end
  end

  describe '#manage?' do
    it 'lets users with update_staff_positions manage staff positions' do
      staff_position = create(:staff_position)
      user = create_user_with_update_staff_positions_in_convention(staff_position.convention)
      assert_policy_allows StaffPositionPolicy, user, staff_position, :manage?, staff_position.convention
    end

    it 'does not let users without update_staff_positions manage staff_positions' do
      staff_position = create(:staff_position)
      user_con_profile = create(:user_con_profile, convention: staff_position.convention)
      refute StaffPositionPolicy.new(user_con_profile.user, staff_position).manage?
    end
  end

  describe 'Scope' do
    it 'always returns all staff_positions' do
      create_list(:staff_position, 3)
      assert_equal 3, StaffPositionPolicy::Scope.new(nil, StaffPosition.all).resolve.count
    end
  end
end
