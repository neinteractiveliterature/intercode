require 'test_helper'

describe SignupDrop do
  let(:signup) { FactoryGirl.create(:signup, bucket_key: 'unlimited', requested_bucket_key: 'unlimited') }
  let(:signup_drop) { SignupDrop.new(signup) }
  let(:the_run) { signup.run }
  let(:event) { the_run.event }

  %w(run user_con_profile state bucket team_member?).each do |field|
    it "returns the #{field} of the signup" do
      signup_drop.public_send(field).must_equal signup.public_send(field)
    end
  end

  %w(event starts_at ends_at length_seconds).each do |field|
    it "returns the #{field} of the run" do
      signup_drop.public_send(field).must_equal the_run.public_send(field)
    end
  end

  it 'returns the event path' do
    signup_drop.event_url.must_match /events\/#{event.id}/
  end

  it 'returns the withdraw path' do
    signup_drop.withdraw_url.must_match /runs\/#{the_run.id}\/user_signup/
  end
end