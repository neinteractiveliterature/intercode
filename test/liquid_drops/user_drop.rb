require 'test_helper'

describe UserDrop do
  let(:user) { create(:user) }
  let(:user_drop) { UserDrop.new(user) }

  %w[email first_name last_name].each do |field|
    it "returns the #{field} of the user" do
      assert_equal user.public_send(field), user_drop.public_send(field)
    end
  end
end
