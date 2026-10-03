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
  let(:zebras_bucket) { bucket_with_key(registration_policy, "zebras") }
  let(:aardvarks_bucket) { bucket_with_key(registration_policy, "aardvarks") }

  def presenter_for(filters: {}, sort: [], visible_field_ids: nil)
    Tables::SignupsTableResultsPresenter.for_run(the_run, site_admin, filters, sort, visible_field_ids)
  end

  def csv_rows(visible_field_ids)
    CSV.parse(presenter_for(visible_field_ids:).csv_enumerator.to_a.join)
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

  describe "filtering by attendee and event" do
    let(:ann_profile) do
      create(
        :user_con_profile,
        convention:,
        first_name: "Ann",
        last_name: "Aardvark",
        user: create(:user, email: "ann@example.com")
      )
    end
    let(:zed_profile) do
      create(
        :user_con_profile,
        convention:,
        first_name: "Zed",
        last_name: "Zebra",
        user: create(:user, email: "zed@example.net")
      )
    end
    let(:ann_signup) { create(:signup, run: the_run, user_con_profile: ann_profile, bucket_id: zebras_bucket.id) }
    let(:zed_signup) do
      create(:signup, run: the_run, user_con_profile: zed_profile, state: "waitlisted", counted: false, bucket_id: nil)
    end

    before do
      ann_signup
      zed_signup
    end

    it "filters by state, name, event title, and email" do
      assert_equal [zed_signup.id], presenter_for(filters: { "state" => "waitlisted" }).scoped.map(&:id)
      assert_equal [ann_signup.id], presenter_for(filters: { "name" => "aardvark" }).scoped.map(&:id)
      assert_equal [ann_signup.id, zed_signup.id].sort,
                   presenter_for(filters: { "event_title" => event.title }).scoped.map(&:id).sort
      assert_empty presenter_for(filters: { "event_title" => "no such event" }).scoped
      assert_equal [zed_signup.id], presenter_for(filters: { "email" => "EXAMPLE.NET" }).scoped.map(&:id)
    end

    it "sorts by name, email, and age" do
      assert_equal [ann_signup.id, zed_signup.id],
                   presenter_for(sort: [{ field: "name", desc: false }]).scoped.map(&:id)
      assert_equal [zed_signup.id, ann_signup.id], presenter_for(sort: [{ field: "name", desc: true }]).scoped.map(&:id)
      assert_equal [ann_signup.id, zed_signup.id],
                   presenter_for(sort: [{ field: "email", desc: false }]).scoped.map(&:id)
      ann_profile.update!(birth_date: Date.new(1960, 1, 1))
      zed_profile.update!(birth_date: Date.new(2000, 1, 1))

      assert_equal [zed_signup.id, ann_signup.id], presenter_for(sort: [{ field: "age", desc: false }]).scoped.map(&:id)
      assert_equal [ann_signup.id, zed_signup.id], presenter_for(sort: [{ field: "age", desc: true }]).scoped.map(&:id)
    end

    it "exports CSV, including bucket descriptions and choice" do
      rows = csv_rows(%w[name event_title state bucket email choice])

      assert_equal %w[Name Event State Bucket Email Choice], rows.first
      assert_includes rows,
                      ["Aardvark, Ann", event.title, "confirmed", "Zebras (no preference)", "ann@example.com", "1"]
      assert_includes rows, ["Zebra, Zed", event.title, "waitlisted", nil, "zed@example.net", "N/C"]
    end

    it "includes the attendee's age only when the viewer can read birth dates" do
      ann_profile.update!(birth_date: Date.new(1990, 1, 1))

      rows = csv_rows(%w[name age])

      assert_equal (the_run.starts_at.year - 1990).to_s, rows.find { |row| row.first == "Aardvark, Ann" }.second
    end
  end

  describe ".format_bucket" do
    it "describes buckets and requested buckets" do
      assert_equal "Zebras (no preference)", Tables::SignupsTableResultsPresenter.format_bucket(zebras_bucket, nil)
      assert_equal "Zebras", Tables::SignupsTableResultsPresenter.format_bucket(zebras_bucket, zebras_bucket)
      assert_equal "Aardvarks (requested Zebras)",
                   Tables::SignupsTableResultsPresenter.format_bucket(aardvarks_bucket, zebras_bucket)
      assert_equal "None (requested Zebras)", Tables::SignupsTableResultsPresenter.format_bucket(nil, zebras_bucket)
      assert_nil Tables::SignupsTableResultsPresenter.format_bucket(nil, nil)
    end
  end

  describe ".signup_spy_for_convention" do
    it "lists the convention's signups, newest first" do
      older = create(:signup, run: the_run, bucket_id: zebras_bucket.id, created_at: 1.day.ago)
      newer = create(:signup, run: the_run, bucket_id: aardvarks_bucket.id)

      presenter = Tables::SignupsTableResultsPresenter.signup_spy_for_convention(convention, site_admin)

      assert_equal [newer.id, older.id], presenter.scoped.map(&:id)
      assert_equal %i[name event_title state created_at choice], presenter.visible_field_ids
    end
  end
end
