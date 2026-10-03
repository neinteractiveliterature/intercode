# frozen_string_literal: true
require "test_helper"

class Tables::EventProposalsTableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

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
      },
      public_description: "Elevator pitch"
    )
    section.form_items.create!(
      item_type: "free_text",
      identifier: "secret",
      visibility: "admin",
      properties: {
        "lines" => 1,
        "caption" => "Secret"
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
        "secret" => "Hidden info",
        "genre" => ["scifi"]
      }
    )
  end

  before { event_proposal }

  def presenter_for(visible_field_ids = nil, pundit_user: site_admin)
    Tables::EventProposalsTableResultsPresenter.for_convention(convention, pundit_user, {}, [], visible_field_ids)
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil)
    Tables::EventProposalsTableResultsPresenter.for_convention(convention, site_admin, filters, sort, visible_field_ids)
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

    assert_equal ["Title", "Elevator pitch", "Genre"], rows.first
    assert_equal [event_proposal.title, "A thrilling tale", "Science Fiction"], rows.second
  end

  it "shows hidden form items to users with a high enough role" do
    admin_profile = create(:user_con_profile, convention:)
    staff_position = create(:staff_position, convention:, user_con_profiles: [admin_profile])
    %w[read_pending_event_proposals update_event_proposals].each do |permission|
      staff_position.permissions.create!(event_category:, permission:)
    end
    rows = csv_rows(presenter_for(%w[form_items.secret], pundit_user: admin_profile.user))

    assert_equal "Hidden info", rows.second.first
  end

  it "replaces hidden form item values with placeholder text for users without a high enough role" do
    rows = csv_rows(presenter_for(%w[form_items.secret], pundit_user: event_proposal.owner.user))

    assert_equal I18n.t("forms.hidden_text.admin"), rows.second.first
  end

  describe "with multiple proposals" do
    let(:other_category) { create(:event_category, convention:, name: "Zulu Games") }
    let(:other_owner) { create(:user_con_profile, convention:, first_name: "Zed", last_name: "Zebra") }
    let(:other_proposal) do
      create(
        :event_proposal,
        convention:,
        event_category: other_category,
        owner: other_owner,
        title: "Zebra Zone",
        status: "accepted",
        length_seconds: 90.minutes.to_i,
        registration_policy:
          RegistrationPolicy.build_from_hash(
            buckets: [{ key: "players", name: "Players", slots_limited: true, minimum_slots: 4, total_slots: 6 }]
          )
      )
    end

    before { other_proposal }

    it "excludes draft proposals" do
      create(:event_proposal, convention:, event_category:, status: "draft")

      assert_equal [event_proposal.id, other_proposal.id].sort, build_presenter.scoped.map(&:id).sort
    end

    it "filters by category, title, owner, and status" do
      assert_equal [other_proposal.id], filtered_ids(:event_category, other_category.id.to_s)
      assert_equal [other_proposal.id], filtered_ids(:title, "ZEBRA")
      assert_equal [other_proposal.id], filtered_ids(:owner, "zebra")
      assert_equal [event_proposal.id], filtered_ids(:status, "proposed")
    end

    it "sorts by category, owner, and status" do
      category_order =
        [event_category, other_category].sort_by(&:name)
          .map { |c| c == event_category ? event_proposal.id : other_proposal.id }

      assert_equal category_order, sorted_ids(:event_category)
      assert_equal [other_proposal.id, event_proposal.id], sorted_ids(:owner, desc: true)
      assert_sortable(:status, :title, :submitted_at, :updated_at)
    end

    it "exports category, owner, capacity, and duration" do
      rows = csv_rows(build_presenter(visible_field_ids: %w[event_category owner total_slots length_seconds]))

      assert_equal ["Category", "Submitted by", "Capacity", "Duration"], rows.first
      assert_includes rows, ["Zulu Games", "Zebra, Zed", "4-6", "1:30"]
    end

    it "exports fixed and unlimited capacity" do
      create(
        :event_proposal,
        convention:,
        event_category:,
        title: "Fixed Fun",
        registration_policy:
          RegistrationPolicy.build_from_hash(
            buckets: [{ key: "players", name: "Players", slots_limited: true, minimum_slots: 5, total_slots: 5 }]
          )
      )
      create(
        :event_proposal,
        convention:,
        event_category:,
        title: "Open Fun",
        registration_policy: RegistrationPolicy.unlimited
      )

      rows = csv_rows(build_presenter(visible_field_ids: %w[title total_slots]))

      assert_equal "5", rows.find { |row| row.first == "Fixed Fun" }.second
      assert_equal "Unlimited", rows.find { |row| row.first == "Open Fun" }.second
    end

    it "exports an empty capacity for proposals without a registration policy" do
      event_proposal.update_columns(registration_policy_id: nil) # rubocop:disable Rails/SkipsModelValidations

      rows = csv_rows(build_presenter(visible_field_ids: %w[title total_slots]))

      assert_equal "", rows.find { |row| row.first == event_proposal.title }.second.to_s
    end
  end

  describe ".describe_duration" do
    it "formats hours and minutes" do
      assert_equal "2:05", Tables::EventProposalsTableResultsPresenter.describe_duration(2.hours + 5.minutes)
    end
  end
end
