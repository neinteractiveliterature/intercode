require 'test_helper'

class RegistrationPolicy::UnlimitedTest < ActiveSupport::TestCase
  let(:event_run) { FactoryGirl.create :run }
  subject { RegistrationPolicy.unlimited }

  it "is valid" do
    subject.must_be :valid?
  end

  it "has one bucket" do
    subject.buckets.size.must_equal 1
  end

  it "allows all signups" do
    3.times do |i|
      event_run.signups.reload

      signup_user_con_profile = FactoryGirl.create(:user_con_profile, convention: event_run.event.convention)
      signup = FactoryGirl.build(:signup, run: event_run, user_con_profile: signup_user_con_profile)
      bucket = subject.best_bucket_for_signup(signup, event_run.signups)
      bucket.wont_be_nil

      signup.bucket_key = bucket.key
      signup.save!
    end
  end

  it "serializes and deserializes" do
    json = RegistrationPolicy.dump(subject)
    deserialized = RegistrationPolicy.load(json)
    deserialized.buckets.must_equal subject.buckets
  end
end
