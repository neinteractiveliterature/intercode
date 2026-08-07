# frozen_string_literal: true
require "test_helper"

class NotifierPreviewFactoryTest < ActiveSupport::TestCase
  let(:convention) { create(:convention, :with_notification_templates) }
  let(:registration_policy) do
    RegistrationPolicy.build_from_hash(buckets: [{ key: "dogs", name: "Dogs", slots_limited: true, total_slots: 10 }])
  end
  let(:event) { create(:event, convention:, registration_policy:) }
  let(:the_run) { create(:run, event:) }
  let(:signup) { create(:signup, run: the_run, bucket_id: bucket_with_key(registration_policy, "dogs").id) }

  before { signup }

  describe "for a notifier that takes a move_result" do
    it "builds a move_result whose bucket resolves to the signup's actual bucket" do
      factory = NotifierPreviewFactory.new(event_key: "signups/user_signup_moved", convention:)
      move_result = factory.notifier.move_result

      assert_equal signup.bucket_id, move_result.bucket_id
      assert_equal "Dogs", move_result.bucket&.name
    end
  end
end
