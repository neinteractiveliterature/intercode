require "test_helper"

describe SignupDrop do
  let(:signup) do
    created_signup = create(:signup)
    created_signup.update!(requested_bucket_id: created_signup.bucket_id)
    created_signup
  end
  let(:signup_drop) { SignupDrop.new(signup) }
  let(:the_run) { signup.run }
  let(:event) { the_run.event }

  %w[run user_con_profile state bucket team_member?].each do |field|
    it "returns the #{field} of the signup" do
      assert_equal signup.public_send(field), signup_drop.public_send(field)
    end
  end

  %w[event starts_at ends_at length_seconds].each do |field|
    it "returns the #{field} of the run" do
      assert_equal the_run.public_send(field), signup_drop.public_send(field)
    end
  end

  it "returns the event path" do
    assert_match %r{events/#{event.id}}, signup_drop.event_url
  end
end
