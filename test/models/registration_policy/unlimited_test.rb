require 'test_helper'

class RegistrationPolicy::UnlimitedTest < ActiveSupport::TestCase
  let(:event_run) { FactoryGirl.create :run }
  subject { RegistrationPolicy::Unlimited.new }
  
  it "has one bucket" do
    subject.buckets.size.must_equal 1
  end
  
  it "allows all signups" do
    3.times do |i|
      event_run.signups.reload
      
      signup = FactoryGirl.build(:signup, run: event_run)
      bucket = subject.bucket_for_new_signup(signup, event_run.signups)
      bucket.wont_be_nil
      
      signup.bucket_key = bucket.key
      signup.save!
    end
  end
end
