# frozen_string_literal: true
require "test_helper"

class Tables::RunsTableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

  let(:site_admin) { create(:site_admin) }
  let(:viewer_profile) { create(:user_con_profile, convention:) }
  let(:convention) { create(:convention) }
  let(:event_category) { create(:event_category, convention:, name: "Alpha Games") }
  let(:other_category) { create(:event_category, convention:, name: "Zulu Games") }
  let(:team_member_profile) { create(:user_con_profile, convention:, first_name: "Tessa", last_name: "Teammember") }
  let(:room) { create(:room, convention:, name: "Ballroom") }
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
      title: "Alpha Adventure",
      author: "Ada Author",
      short_blurb: "Short blurb text",
      description: "Long description",
      content_warnings: "Mild peril",
      participant_communications: "Bring dice",
      length_seconds: 3.hours + 30.minutes,
      registration_policy:
        RegistrationPolicy.build_from_hash(
          buckets: [{ key: "players", name: "Players", slots_limited: true, minimum_slots: 4, total_slots: 6 }]
        ),
      additional_info: {
        "pitch" => "A thrilling tale",
        "internal_notes" => "Not for the catalog"
      }
    )
  end
  let(:other_event) do
    create(:event, convention:, event_category: other_category, title: "Zebra Zone", length_seconds: 1.hour)
  end
  let(:event_run) { create(:run, event:, starts_at: convention.starts_at + 2.days, rooms: [room]) }
  let(:other_event_run) { create(:run, event: other_event, starts_at: convention.starts_at + 1.day) }

  before do
    create(:team_member, event:, user_con_profile: team_member_profile)
    event_run
    other_event_run
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil, pundit_user: AuthorizationInfo.cast(site_admin))
    Tables::RunsTableResultsPresenter.for_convention(convention:, pundit_user:, filters:, sort:, visible_field_ids:)
  end

  it "filters by category, title, and title prefix" do
    assert_equal [other_event_run.id], filtered_ids(:category, other_category.id.to_s)
    assert_equal [event_run.id], filtered_ids(:title, "adventure")
    assert_equal [other_event_run.id], filtered_ids(:title_prefix, "Zebra")
    assert_equal [event_run.id, other_event_run.id].sort, filtered_ids(:title_prefix, "").sort
  end

  it "filters and sorts by the viewer's rating" do
    pundit_user = AuthorizationInfo.cast(viewer_profile.user)
    create(:event_rating, event:, user_con_profile: viewer_profile, rating: 1)
    create(:event_rating, event: other_event, user_con_profile: viewer_profile, rating: -1)

    filtered = build_presenter(filters: { "my_rating" => ["1"] }, pundit_user:).scoped.map(&:id)
    ignored_blank = build_presenter(filters: { "my_rating" => "" }, pundit_user:).scoped.map(&:id)
    sorted = build_presenter(sort: [{ field: "my_rating", desc: true }], pundit_user:).scoped.map(&:id)

    assert_equal [event_run.id], filtered
    assert_equal [event_run.id, other_event_run.id].sort, ignored_blank.sort
    assert_equal [event_run.id, other_event_run.id], sorted
  end

  it "does not sort by rating when there is no user con profile" do
    assert_equal [event_run.id, other_event_run.id].sort, sorted_ids(:my_rating).sort
  end

  it "sorts by title and start time" do
    assert_equal [event_run.id, other_event_run.id], sorted_ids(:title)
    assert_equal [other_event_run.id, event_run.id], sorted_ids(:title, desc: true)
    assert_equal [other_event_run.id, event_run.id], sorted_ids(:starts_at)
    assert_equal [other_event_run.id, event_run.id], sorted_ids(:ends_at)
    assert_equal [event_run.id, other_event_run.id], sorted_ids(:length_seconds, desc: true)
    assert_equal [event_run.id, other_event_run.id], sorted_ids(:category)
    assert_equal [other_event_run.id, event_run.id], sorted_ids(:category, desc: true)
  end

  it "does not include the form items or filter-only fields in the default visible fields" do
    assert_not_includes build_presenter.visible_field_ids, :form_items
    assert_not_includes build_presenter.visible_field_ids, :title_prefix
  end

  it "exports every default column without error" do
    rows = csv_rows

    assert_equal 3, rows.size
  end

  it "exports event details as CSV" do
    columns = %w[
      category
      title
      length_seconds
      total_slots
      team_members
      author
      room_names
      short_blurb
      description
      content_warnings
      participant_communications
    ]
    row = csv_rows(columns).find { |r| r.second == "Alpha Adventure" }

    assert_equal(
      [
        event_category.name,
        "Alpha Adventure",
        "3:30",
        "4-6",
        "Tessa Teammember",
        "Ada Author",
        "Ballroom",
        "Short blurb text",
        "Long description",
        "Mild peril",
        "Bring dice"
      ],
      row
    )
  end

  it "exports capacity for fixed and unlimited events" do
    fixed_event =
      create(
        :event,
        convention:,
        title: "Fixed Fun",
        registration_policy:
          RegistrationPolicy.build_from_hash(
            buckets: [{ key: "players", name: "Players", slots_limited: true, minimum_slots: 5, total_slots: 5 }]
          )
      )
    create(:run, event: fixed_event)

    rows = csv_rows(%w[title total_slots])

    assert_equal "5", rows.find { |r| r.first == "Fixed Fun" }.second
    assert_equal "unlimited", rows.find { |r| r.first == "Zebra Zone" }.second
  end

  it "exports the event's creation time" do
    assert_not_nil csv_rows(%w[event_created_at]).second.first
  end

  describe "form items" do
    it "exports event form items exposed in the event catalog" do
      rows = csv_rows(%w[title form_items.pitch])

      assert_equal ["Title", "Elevator pitch"], rows.first
      assert_includes rows, ["Alpha Adventure", "A thrilling tale"]
    end

    it "does not export form items that are not exposed in the event catalog" do
      rows = csv_rows(%w[form_items.internal_notes])

      assert_empty rows.drop(1).flatten.compact
    end

    it "filters by form item values" do
      assert_equal [event_run.id], filtered_ids(:form_items, { "pitch" => ["A thrilling tale"] })
      assert_empty filtered_ids(:form_items, { "pitch" => ["Something else"] })
    end
  end
end
