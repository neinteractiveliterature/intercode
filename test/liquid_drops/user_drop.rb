require 'test_helper'

describe UserDrop do
  let(:user) { FactoryBot.create(:user) }
  let(:user_drop) { UserDrop.new(user) }

  %w(email first_name last_name).each do |field|
    it "returns the #{field} of the user" do
      user_drop.public_send(field).must_equal user.public_send(field)
    end
  end
end