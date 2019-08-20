require 'test_helper'
require_relative 'convention_permissions_test_helper'

class RoomPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:room) { create(:room) }
  let(:convention) { room.convention }

  describe '#read?' do
    it 'lets anyone read any room' do
      assert RoomPolicy.new(nil, room).read?
    end
  end

  describe '#manage?' do
    %i[gm_liaison].each do |priv|
      it "lets people with the #{priv} privilege manage rooms" do
        user_con_profile = create(:user_con_profile, convention: convention, priv => true)
        assert RoomPolicy.new(user_con_profile.user, room).manage?
      end
    end

    it 'lets people with update_rooms manage rooms' do
      user = create_user_with_update_rooms_in_convention(convention)
      assert RoomPolicy.new(user, room).manage?
    end

    it 'does not let regular users manage rooms' do
      user_con_profile = create(:user_con_profile, convention: convention)
      refute RoomPolicy.new(user_con_profile.user, room).manage?
    end
  end

  describe 'Scope' do
    it 'always returns all rooms' do
      create_list(:room, 3)
      assert_equal 3, RoomPolicy::Scope.new(nil, Room.all).resolve.count
    end
  end
end
