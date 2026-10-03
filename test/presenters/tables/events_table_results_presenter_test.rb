# frozen_string_literal: true
require "test_helper"

class Tables::EventsTableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

  let(:site_admin) { create(:site_admin) }
  let(:viewer_profile) { create(:user_con_profile, convention:) }
  let(:pundit_user) { AuthorizationInfo.cast(viewer_profile.user) }
  let(:convention) { create(:convention) }
  let(:event_category) { create(:event_category, convention:) }
  let(:other_category) { create(:event_category, convention:) }
  let(:owner) { create(:user, first_name: "Olive", last_name: "Owner") }
  let(:event) do
    section = event_category.event_form.form_sections.create!(title: "Section")
    section.form_items.create!(
      item_type: "free_text",
      identifier: "pitch",
      expose_in: ["event_catalog"],
      public_description: "Elevator pitch",
      properties: {
        "lines" => 1,
        "caption" => "Pitch"
      }
    )
    section.form_items.create!(
      item_type: "free_text",
      identifier: "internal_notes",
      properties: {
        "lines" => 1,
        "caption" => "Notes"
      }
    )
    create(
      :event,
      convention:,
      event_category:,
      owner:,
      title: "Alpha Adventure",
      additional_info: {
        "pitch" => "A thrilling tale",
        "internal_notes" => "Not for the catalog"
      }
    )
  end
  let(:other_event) { create(:event, convention:, event_category: other_category, title: "Zebra Zone") }
  let(:event_run) { create(:run, event:, starts_at: convention.starts_at + 2.days) }
  let(:other_event_run) { create(:run, event: other_event, starts_at: convention.starts_at + 1.day) }

  before do
    event_run
    other_event_run
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil, pundit_user: AuthorizationInfo.cast(site_admin))
    Tables::EventsTableResultsPresenter.for_convention(convention:, pundit_user:, filters:, sort:, visible_field_ids:)
  end

  it "filters by category, title, and title prefix" do
    assert_equal [other_event.id], filtered_ids(:category, other_category.id.to_s)
    assert_equal [event.id], filtered_ids(:title, "adventure")
    assert_equal [other_event.id], filtered_ids(:title_prefix, "Zebra")
    assert_equal [event.id, other_event.id].sort, filtered_ids(:title_prefix, "").sort
  end

  it "filters by text search" do
    PgSearch::Multisearch.rebuild(Event)

    assert_equal [other_event.id], filtered_ids(:text_search, "Zebra")
  end

  it "filters and sorts by the viewer's rating" do
    create(:event_rating, event:, user_con_profile: viewer_profile, rating: 1)
    create(:event_rating, event: other_event, user_con_profile: viewer_profile, rating: -1)
    presenter_class = Tables::EventsTableResultsPresenter

    filtered =
      presenter_class
        .for_convention(convention:, pundit_user:, filters: { "my_rating" => ["1"] }, sort: [])
        .scoped
        .map(&:id)
    ignored_blank =
      presenter_class
        .for_convention(convention:, pundit_user:, filters: { "my_rating" => "" }, sort: [])
        .scoped
        .map(&:id)
    sorted =
      presenter_class
        .for_convention(convention:, pundit_user:, filters: {}, sort: [{ field: "my_rating", desc: true }])
        .scoped
        .map(&:id)

    assert_equal [event.id], filtered
    assert_equal [event.id, other_event.id].sort, ignored_blank.sort
    assert_equal [event.id, other_event.id], sorted
  end

  it "does not sort by rating when there is no user con profile" do
    assert_equal [event.id, other_event.id].sort, sorted_ids(:my_rating).sort
  end

  it "sorts by title, owner, creation time, and first scheduled run" do
    assert_equal [event.id, other_event.id], sorted_ids(:title)
    assert_equal [other_event.id, event.id], sorted_ids(:title, desc: true)
    assert_equal [event.id], sorted_ids(:owner)
    assert_equal [other_event.id, event.id], sorted_ids(:first_scheduled_run_start)
    assert_equal [event.id, other_event.id], sorted_ids(:first_scheduled_run_start, desc: true)
    assert_sortable(:created_at, :text_search)
  end

  it "does not sort by first scheduled run without permission to see the schedule" do
    convention.update!(show_schedule: "no")

    assert_raises(Pundit::NotAuthorizedError) do
      build_presenter(sort: [{ field: "first_scheduled_run_start", desc: false }], pundit_user: nil).scoped.to_a
    end
  end

  it "exports the category column" do
    rows = csv_rows(%w[title created_at])

    assert_equal ["Title", "Created at"], rows.first
    assert_includes rows.map(&:first), "Alpha Adventure"
  end

  describe "form items" do
    it "exports event form items exposed in the event catalog" do
      rows = csv_rows(%w[title form_items.pitch form_items.internal_notes])

      row = rows.find { |r| r.first == "Alpha Adventure" }
      assert_equal ["Title", "Elevator pitch", "Internal notes"], rows.first
      assert_equal ["Alpha Adventure", "A thrilling tale", nil], row
    end

    it "filters by form item values" do
      assert_equal [event.id], filtered_ids(:form_items, { "pitch" => ["A thrilling tale"] })
      assert_empty filtered_ids(:form_items, { "pitch" => ["Something else"] })
      assert_equal [event.id, other_event.id].sort, filtered_ids(:form_items, { "pitch" => [] }).sort
    end
  end
end
