require 'test_helper'

class RoomPolicyTest < ActiveSupport::TestCase
  describe '#read?' do
    it 'lets anyone read any room' do
      room = create(:room)
      assert RoomPolicy.new(nil, room).read?
    end
  end

  describe '#manage?' do
    %i[gm_liaison scheduling].each do |priv|
      it "lets people with the #{priv} privilege manage rooms" do
        room = create(:room)
        user_con_profile = create(:user_con_profile, convention: room.convention, priv => true)
        assert RoomPolicy.new(user_con_profile.user, room).manage?
      end
    end

    it 'does not let regular users manage rooms' do
      room = create(:room)
      user_con_profile = create(:user_con_profile, convention: room.convention)
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
