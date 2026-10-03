# frozen_string_literal: true
require "test_helper"

class Tables::EventProposalsTableResultsPresenterTest < ActiveSupport::TestCase
  let(:site_admin) { create(:site_admin) }
  let(:convention) { create(:convention) }
  let(:event_category) { create(:event_category, convention:) }
  let(:event_proposal) do
    section = event_category.event_proposal_form.form_sections.create!(title: "Section")
    section.form_items.create!(
      item_type: "free_text",
      identifier: "pitch",
      properties: {
        "lines" => 1,
        "caption" => "Pitch"
      }
    )
    section.form_items.create!(
      item_type: "multiple_choice",
      identifier: "genre",
      properties: {
        "caption" => "Genre",
        "style" => "radio_vertical",
        "choices" => [{ "value" => "scifi", "caption" => "Science Fiction" }]
      }
    )
    create(
      :event_proposal,
      convention:,
      event_category:,
      additional_info: {
        "pitch" => "A thrilling tale",
        "genre" => ["scifi"]
      }
    )
  end

  before { event_proposal }

  def presenter_for(visible_field_ids = nil)
    Tables::EventProposalsTableResultsPresenter.for_convention(convention, site_admin, {}, [], visible_field_ids)
  end

  def csv_rows(presenter)
    CSV.parse(presenter.csv_enumerator.to_a.join)
  end

  it "exports without error when no visible fields are specified, omitting path-based fields" do
    rows = csv_rows(presenter_for)

    assert_not_includes rows.first, "Convention-specific form items"
    assert_equal event_proposal.title, rows.second[rows.first.index("Title")]
  end

  it "exports form items addressed by path" do
    rows = csv_rows(presenter_for(%w[title form_items.pitch form_items.genre]))

    assert_equal %w[Title pitch genre], rows.first
    assert_equal [event_proposal.title, "A thrilling tale", "Science Fiction"], rows.second
  end
end
