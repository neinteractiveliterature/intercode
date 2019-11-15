require 'test_helper'

class RegistrationPolicyTest < ActiveSupport::TestCase
  describe '#anything_bucket' do
    it 'finds the anything bucket' do
      anything_bucket = RegistrationPolicy::Bucket.new(key: 'dont_care', anything: true)

      policy = RegistrationPolicy.new(
        buckets: [
          RegistrationPolicy::Bucket.new(key: 'pcs'),
          RegistrationPolicy::Bucket.new(key: 'npcs'),
          anything_bucket
        ]
      )

      assert_equal anything_bucket, policy.anything_bucket
    end
  end

  describe '#total_slots' do
    it 'only counts counted buckets' do
      policy = RegistrationPolicy.new(
        buckets: [
          RegistrationPolicy::Bucket.new(key: 'pcs', total_slots: 2),
          RegistrationPolicy::Bucket.new(key: 'npcs', total_slots: 5, not_counted: true)
        ]
      )

      assert_equal 2, policy.total_slots
    end
  end

  describe 'validations' do
    it 'validates that there is only one anything bucket' do
      policy = RegistrationPolicy.new(
        buckets: [
          RegistrationPolicy::Bucket.new(key: 'pcs'),
          RegistrationPolicy::Bucket.new(key: 'npcs'),
          RegistrationPolicy::Bucket.new(key: 'anything1', anything: true),
          RegistrationPolicy::Bucket.new(key: 'anything2', anything: true)
        ]
      )

      refute policy.valid?
      assert policy.errors.full_messages.first =~ /at most 1 flex bucket/
    end
  end
end
