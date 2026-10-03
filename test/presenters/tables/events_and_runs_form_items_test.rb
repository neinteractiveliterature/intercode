# frozen_string_literal: true
require "test_helper"

class Tables::EventsAndRunsFormItemsTest < ActiveSupport::TestCase
  let(:site_admin) { create(:site_admin) }
  let(:convention) { create(:convention) }
  let(:event_category) { create(:event_category, convention:) }
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
      additional_info: {
        "pitch" => "A thrilling tale",
        "internal_notes" => "Not for the catalog"
      }
    )
  end
  let(:the_run) { create(:run, event:) }

  before { the_run }

  def csv_rows(presenter)
    CSV.parse(presenter.csv_enumerator.to_a.join)
  end

  def runs_presenter(filters: {}, visible_field_ids: nil)
    Tables::RunsTableResultsPresenter.for_convention(convention:, pundit_user: site_admin, filters:, visible_field_ids:)
  end

  def events_presenter(filters: {}, visible_field_ids: nil)
    Tables::EventsTableResultsPresenter.for_convention(
      convention:,
      pundit_user: site_admin,
      filters:,
      visible_field_ids:
    )
  end

  describe "runs" do
    it "exports event form items exposed in the event catalog" do
      rows = csv_rows(runs_presenter(visible_field_ids: %w[title form_items.pitch]))

      assert_equal ["Title", "Elevator pitch"], rows.first
      assert_equal [event.title, "A thrilling tale"], rows.second
    end

    it "does not export form items that are not exposed in the event catalog" do
      rows = csv_rows(runs_presenter(visible_field_ids: %w[form_items.internal_notes]))

      assert_nil rows.second.first
    end

    it "does not include the form items field in the default visible fields" do
      assert_not_includes runs_presenter.visible_field_ids, :form_items
    end

    it "filters by form item values" do
      matching = runs_presenter(filters: { "form_items" => { "pitch" => ["A thrilling tale"] } }).scoped
      other = runs_presenter(filters: { "form_items" => { "pitch" => ["Something else"] } }).scoped

      assert_equal [the_run.id], matching.map(&:id)
      assert_empty other
    end
  end

  describe "events" do
    it "exports event form items exposed in the event catalog" do
      rows = csv_rows(events_presenter(visible_field_ids: %w[title form_items.pitch form_items.internal_notes]))

      assert_equal [event.title, "A thrilling tale", nil], rows.second
    end

    it "filters by form item values" do
      matching = events_presenter(filters: { "form_items" => { "pitch" => ["A thrilling tale"] } }).scoped
      other = events_presenter(filters: { "form_items" => { "pitch" => ["Something else"] } }).scoped

      assert_equal [event.id], matching.map(&:id)
      assert_empty other
    end
  end
end
