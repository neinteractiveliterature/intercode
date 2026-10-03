# frozen_string_literal: true
require "test_helper"

class RunAvailabilityPresenterTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:registration_policy) do
    RegistrationPolicy.build_from_hash(
      buckets: [
        { key: "players", name: "Players", slots_limited: true, total_slots: 2 },
        { key: "observers", name: "Observers", slots_limited: true, total_slots: 1, not_counted: true }
      ]
    )
  end
  let(:event) { create(:event, convention:, registration_policy:) }
  let(:the_run) { create(:run, event:) }
  let(:presenter) { RunAvailabilityPresenter.new(the_run) }

  def availability_for(key)
    bucket = bucket_with_key(registration_policy, key)
    presenter.availability_by_bucket.find { |ba| ba.bucket.id == bucket.id }
  end

  def sign_up(key, **attrs)
    bucket = bucket_with_key(registration_policy, key)
    create(:signup, run: the_run, bucket_id: bucket.id, requested_bucket_id: bucket.id, **attrs)
  end

  describe "BucketAvailability" do
    it "computes available slots from confirmed signups in the bucket" do
      sign_up("players")
      assert_equal 1, availability_for("players").confirmed_count
      assert_equal 1, availability_for("players").available_slots
      assert availability_for("players").has_availability?
      assert_not availability_for("players").full?
    end

    it "is full once every slot is taken" do
      2.times { sign_up("players") }
      assert_equal 0, availability_for("players").available_slots
      assert_not availability_for("players").has_availability?
      assert availability_for("players").full?
    end

    it "counts signups in not-counted buckets" do
      sign_up("observers", counted: false)
      assert_equal 1, availability_for("observers").confirmed_count
      assert availability_for("observers").full?
    end

    it "does not count waitlisted or withdrawn signups" do
      bucket = bucket_with_key(registration_policy, "players")
      create(:signup, run: the_run, state: "waitlisted", counted: false, requested_bucket_id: bucket.id)
      create(:signup, run: the_run, state: "withdrawn", counted: false)
      assert_equal 0, availability_for("players").confirmed_count
    end

    it "can be exposed to Liquid" do
      assert_kind_of BucketAvailabilityDrop, availability_for("players").to_liquid
    end

    describe "with an unlimited bucket" do
      let(:registration_policy) do
        RegistrationPolicy.build_from_hash(
          buckets: [{ key: "unlimited", name: "Unlimited", slots_limited: false, total_slots: 0 }]
        )
      end

      it "never runs out of slots" do
        3.times { sign_up("unlimited") }
        assert_nil availability_for("unlimited").available_slots
        assert availability_for("unlimited").has_availability?
        assert_not availability_for("unlimited").full?
      end
    end
  end

  describe "#availability_by_bucket" do
    it "has one entry per bucket in the registration policy" do
      assert_equal %w[players observers].sort, presenter.availability_by_bucket.map { |ba| ba.bucket.key }.sort
    end
  end

  describe "slot queries" do
    it "reports slots of both kinds when nothing is taken" do
      assert presenter.has_any_slots?
      assert presenter.has_counted_slots?
      assert presenter.has_not_counted_slots?
      assert_not presenter.full?
    end

    it "reports no counted slots once the counted buckets fill up" do
      2.times { sign_up("players") }

      assert presenter.has_any_slots?
      assert_not presenter.has_counted_slots?
      assert presenter.has_not_counted_slots?
      assert_equal(["observers"], presenter.bucket_availabilities_with_any_slots.map { |ba| ba.bucket.key })
      assert_equal [], presenter.bucket_availabilities_with_counted_slots
      assert_equal(["observers"], presenter.bucket_availabilities_with_not_counted_slots.map { |ba| ba.bucket.key })
    end

    it "reports no not-counted slots once the not-counted buckets fill up" do
      sign_up("observers", counted: false)

      assert presenter.has_any_slots?
      assert presenter.has_counted_slots?
      assert_not presenter.has_not_counted_slots?
      assert_equal(["players"], presenter.bucket_availabilities_with_counted_slots.map { |ba| ba.bucket.key })
    end

    it "is full when every bucket is full" do
      2.times { sign_up("players") }
      sign_up("observers", counted: false)

      assert presenter.full?
      assert_not presenter.has_any_slots?
    end
  end

  describe ".for_runs" do
    it "builds a presenter for each run, keyed by run id" do
      other_run = create(:run, event:)
      sign_up("players")

      presenters = RunAvailabilityPresenter.for_runs(Run.where(id: [the_run.id, other_run.id]))

      assert_equal [the_run.id, other_run.id].sort, presenters.keys.sort
      assert_equal 1,
                   presenters[the_run.id]
                     .availability_by_bucket
                     .find { |ba| ba.bucket.key == "players" }
                     .confirmed_count
      assert_equal 0,
                   presenters[other_run.id]
                     .availability_by_bucket
                     .find { |ba| ba.bucket.key == "players" }
                     .confirmed_count
    end
  end

  it "can be exposed to Liquid" do
    assert_kind_of RunAvailabilityDrop, presenter.to_liquid
  end
end
