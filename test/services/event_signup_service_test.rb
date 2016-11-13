require 'test_helper'

class EventSignupServiceTest < ActiveSupport::TestCase
  let(:event) { FactoryGirl.create :event }
  let(:the_run) { FactoryGirl.create :run, event: event }
  let(:convention) { event.convention }
  let(:user_con_profile) { FactoryGirl.create :user_con_profile, convention: convention }
  let(:requested_bucket_key) { :unlimited }

  subject { EventSignupService.new(user_con_profile, the_run, requested_bucket_key) }

  it 'signs the user up for an event' do
    result = subject.call
    result.must_be :success?
    result.signup.must_be :confirmed?
  end
end