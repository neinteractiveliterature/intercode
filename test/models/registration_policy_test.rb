require 'test_helper'

class RegistrationPolicyTest < ActiveSupport::TestCase
  describe '#anything_bucket' do
    it 'finds the anything bucket' do
      anything_bucket = RegistrationPolicy::Bucket.new(key: "dont_care", anything: true)

      policy = RegistrationPolicy.new(
        buckets: [
          RegistrationPolicy::Bucket.new(key: "pcs"),
          RegistrationPolicy::Bucket.new(key: "npcs"),
          anything_bucket
        ]
      )

      policy.anything_bucket.must_equal anything_bucket
    end
  end

  describe 'validations' do
    it 'validates that there is only one anything bucket' do
      policy = RegistrationPolicy.new(
        buckets: [
          RegistrationPolicy::Bucket.new(key: "pcs"),
          RegistrationPolicy::Bucket.new(key: "npcs"),
          RegistrationPolicy::Bucket.new(key: "anything1", anything: true),
          RegistrationPolicy::Bucket.new(key: "anything2", anything: true)
        ]
      )

      policy.wont_be :valid?
      assert policy.errors.full_messages.first =~ /at most 1 anything bucket/
    end

    it 'validates that the anything bucket is at the end' do
      policy = RegistrationPolicy.new(
        buckets: [
          RegistrationPolicy::Bucket.new(key: "pcs"),
          RegistrationPolicy::Bucket.new(key: "dont_care", anything: true),
          RegistrationPolicy::Bucket.new(key: "npcs")
        ]
      )

      policy.wont_be :valid?
      assert policy.errors.full_messages.first =~ /last in the priority list/
    end
  end
end