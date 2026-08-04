# frozen_string_literal: true
require "test_helper"

class SignupCountPresenterTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }

  describe "with a single-bucket limited event" do
    let(:registration_policy) do
      RegistrationPolicy.build_from_hash(
        buckets: [{ key: "attendees", name: "Attendees", slots_limited: true, total_slots: 10 }]
      )
    end
    let(:event) { create(:event, convention:, registration_policy:) }
    let(:the_run) { create(:run, event:) }
    let(:presenter) { SignupCountPresenter.new(the_run) }

    describe "#confirmed_count" do
      it "counts confirmed signups" do
        create(:signup, run: the_run)
        create(:signup, run: the_run)
        assert_equal 2, presenter.confirmed_count
      end

      it "does not count withdrawn signups" do
        create(:signup, run: the_run)
        create(:signup, run: the_run, state: "withdrawn", counted: false)
        assert_equal 1, presenter.confirmed_count
      end
    end

    describe "#waitlist_count" do
      let(:attendees_bucket_id) { registration_policy.bucket_with_key("attendees").id }

      it "counts waitlisted signups" do
        create(:signup, run: the_run, state: "waitlisted", counted: false, requested_bucket_id: attendees_bucket_id)
        create(:signup, run: the_run, state: "waitlisted", counted: false, requested_bucket_id: attendees_bucket_id)
        assert_equal 2, presenter.waitlist_count
      end

      it "does not count withdrawn signups" do
        create(:signup, run: the_run, state: "waitlisted", counted: false, requested_bucket_id: attendees_bucket_id)
        create(:signup, run: the_run, state: "withdrawn", counted: false, requested_bucket_id: attendees_bucket_id)
        assert_equal 1, presenter.waitlist_count
      end
    end

    describe "#has_waitlist?" do
      let(:attendees_bucket_id) { registration_policy.bucket_with_key("attendees").id }

      it "returns true when there are waitlisted signups" do
        create(:signup, run: the_run, state: "waitlisted", counted: false, requested_bucket_id: attendees_bucket_id)
        assert presenter.has_waitlist?
      end

      it "returns false when there are no waitlisted signups" do
        create(:signup, run: the_run)
        assert_not presenter.has_waitlist?
      end
    end

    describe "#signups_description" do
      let(:attendees_bucket_id) { registration_policy.bucket_with_key("attendees").id }

      it "reports confirmed count" do
        create(:signup, run: the_run)
        create(:signup, run: the_run)
        assert_equal "Signed up: 2", presenter.signups_description
      end

      it "does not count withdrawn signups as confirmed" do
        create(:signup, run: the_run)
        create(:signup, run: the_run, state: "withdrawn", counted: false)
        assert_equal "Signed up: 1", presenter.signups_description
      end

      it "reports waitlisted count when the waitlist is non-empty" do
        create(:signup, run: the_run)
        create(:signup, run: the_run, state: "waitlisted", counted: false, requested_bucket_id: attendees_bucket_id)
        create(:signup, run: the_run, state: "waitlisted", counted: false, requested_bucket_id: attendees_bucket_id)
        assert_equal "Signed up: 1\nWaitlisted: 2", presenter.signups_description
      end
    end
  end

  describe "with a multi-bucket event" do
    let(:registration_policy) do
      RegistrationPolicy.build_from_hash(
        buckets: [
          { key: "dogs", name: "Dogs", slots_limited: true, total_slots: 5 },
          { key: "cats", name: "Cats", slots_limited: true, total_slots: 5 },
          { key: "flex", name: "Flex", slots_limited: true, total_slots: 5, anything: true }
        ]
      )
    end
    let(:event) { create(:event, convention:, registration_policy:) }
    let(:the_run) { create(:run, event:) }
    let(:presenter) { SignupCountPresenter.new(the_run) }
    let(:dogs_bucket_id) { registration_policy.bucket_with_key("dogs").id }
    let(:cats_bucket_id) { registration_policy.bucket_with_key("cats").id }

    describe "#signups_description" do
      it "shows per-bucket confirmed counts" do
        create(:signup, run: the_run, bucket_id: dogs_bucket_id, requested_bucket_id: dogs_bucket_id)
        create(:signup, run: the_run, bucket_id: dogs_bucket_id, requested_bucket_id: dogs_bucket_id)
        create(:signup, run: the_run, bucket_id: cats_bucket_id, requested_bucket_id: cats_bucket_id)
        description = presenter.signups_description
        assert_includes description, "Dogs: 2"
        assert_includes description, "Cats: 1"
      end

      it "does not count withdrawn signups in per-bucket confirmed counts" do
        create(:signup, run: the_run, bucket_id: dogs_bucket_id, requested_bucket_id: dogs_bucket_id)
        create(:signup, run: the_run, state: "withdrawn", counted: false, requested_bucket_id: dogs_bucket_id)
        assert_includes presenter.signups_description, "Dogs: 1"
      end

      it "shows waitlisted count broken down by requested bucket" do
        create(:signup, run: the_run, state: "waitlisted", counted: false, requested_bucket_id: dogs_bucket_id)
        create(:signup, run: the_run, state: "waitlisted", counted: false, requested_bucket_id: dogs_bucket_id)
        create(:signup, run: the_run, state: "waitlisted", counted: false, requested_bucket_id: cats_bucket_id)
        description = presenter.signups_description
        assert_includes description, "Dogs: 2"
        assert_includes description, "Cats: 1"
      end

      it "does not count withdrawn signups in the no-preference waitlist count" do
        # 3 genuine no-preference waitlisted signups
        3.times { create(:signup, run: the_run, state: "waitlisted", counted: false, requested_bucket_id: nil) }
        # 1 withdrawn signup whose requested_bucket_id is nil (e.g. was confirmed via the flex bucket)
        create(:signup, run: the_run, state: "withdrawn", counted: false, requested_bucket_id: nil)
        assert_includes presenter.signups_description, "No preference: 3"
      end
    end
  end
end
