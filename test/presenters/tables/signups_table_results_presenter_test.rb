# frozen_string_literal: true
require "test_helper"

class Tables::SignupsTableResultsPresenterTest < ActiveSupport::TestCase
  let(:site_admin) { create(:site_admin) }
  let(:convention) { create(:convention) }
  let(:registration_policy) do
    RegistrationPolicy.build_from_hash(
      buckets: [
        { key: "zebras", name: "Zebras", slots_limited: true, total_slots: 10 },
        { key: "aardvarks", name: "Aardvarks", slots_limited: true, total_slots: 10 }
      ]
    )
  end
  let(:event) { create(:event, convention:, registration_policy:) }
  let(:the_run) { create(:run, event:) }
  let(:zebras_bucket) { registration_policy.bucket_with_key("zebras") }
  let(:aardvarks_bucket) { registration_policy.bucket_with_key("aardvarks") }

  def presenter_for(filters: {}, sort: [])
    Tables::SignupsTableResultsPresenter.for_run(the_run, site_admin, filters, sort)
  end

  describe "filtering by bucket" do
    it "matches on bucket id, not bucket key" do
      zebra_signup = create(:signup, run: the_run, bucket_id: zebras_bucket.id)
      create(:signup, run: the_run, bucket_id: aardvarks_bucket.id)

      results = presenter_for(filters: { "bucket" => [zebras_bucket.id.to_s] }).scoped

      assert_equal [zebra_signup.id], results.map(&:id)
    end

    it "returns no rows for a bucket key (the pre-fix, now-invalid filter value)" do
      create(:signup, run: the_run, bucket_id: zebras_bucket.id)

      results = presenter_for(filters: { "bucket" => ["zebras"] }).scoped

      assert_empty results
    end
  end

  describe "sorting by bucket" do
    it "sorts case-insensitively by bucket name rather than by bucket row id" do
      # aardvarks_bucket is created after zebras_bucket, so it has the higher id -- if this were
      # still sorting by bucket_id, ascending order would put the zebra signup first.
      zebra_signup = create(:signup, run: the_run, bucket_id: zebras_bucket.id)
      aardvark_signup = create(:signup, run: the_run, bucket_id: aardvarks_bucket.id)

      results = presenter_for(sort: [{ field: "bucket", desc: false }]).scoped

      assert_equal [aardvark_signup.id, zebra_signup.id], results.map(&:id)
    end

    it "keeps signups with no bucket in the result set" do
      no_bucket_signup = create(:signup, run: the_run, state: "waitlisted", counted: false, bucket_id: nil)
      zebra_signup = create(:signup, run: the_run, bucket_id: zebras_bucket.id)

      results = presenter_for(sort: [{ field: "bucket", desc: false }]).scoped

      assert_equal [zebra_signup.id, no_bucket_signup.id].sort, results.map(&:id).sort
    end
  end
end
