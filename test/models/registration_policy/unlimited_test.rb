require 'test_helper'

class RegistrationPolicy::UnlimitedTest < ActiveSupport::TestCase
  let(:convention) { create :convention, :with_notification_templates }
  let(:event) { create :event, convention: convention}
  let(:event_run) { create :run, event: event }
  let(:free_ticket_type) { create(:free_ticket_type, convention: convention) }
  subject { RegistrationPolicy.unlimited }

  it 'is valid' do
    assert subject.valid?
  end

  it 'has one bucket' do
    assert_equal 1, subject.buckets.size
  end

  it 'allows all signups' do
    bucket_key = subject.buckets.first.key

    3.times do |_i|
      event_run.signups.reload

      signup_user_con_profile = create(:user_con_profile, convention: convention)
      create(:ticket, user_con_profile: signup_user_con_profile, ticket_type: free_ticket_type)
      result = EventSignupService.new(signup_user_con_profile, event_run, bucket_key, signup_user_con_profile.user).call
      assert result.success?
    end
  end

  it 'serializes and deserializes' do
    json = subject.to_json
    deserialized = RegistrationPolicy.new.from_json(json)
    assert_equal subject.buckets, deserialized.buckets
  end
end
