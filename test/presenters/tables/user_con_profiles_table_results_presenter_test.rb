# frozen_string_literal: true
require "test_helper"

class Tables::UserConProfilesTableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

  let(:convention) { create(:convention) }
  let(:admin_profile) { create(:user_con_profile, convention:, first_name: "Ada", last_name: "Admin") }
  let(:pundit_user) { AuthorizationInfo.cast(admin_profile.user) }
  let(:free_type) { create(:free_ticket_type, convention:) }
  let(:paid_type) { create(:paid_ticket_type, convention:) }
  let(:ann) do
    create(
      :user_con_profile,
      convention:,
      first_name: "Ann",
      last_name: "Aardvark",
      user: create(:user, email: "ann@example.com", first_name: "Ann", last_name: "Aardvark")
    )
  end
  let(:zed) do
    create(
      :user_con_profile,
      convention:,
      first_name: "Zed",
      last_name: "Zebra",
      user: create(:user, email: "zed@example.net", first_name: "Zed", last_name: "Zebra")
    )
  end
  let(:ann_ticket) do
    order = create(:order, user_con_profile: ann, status: "paid")
    order_entry =
      create(:order_entry, order:, product: paid_type.providing_products.first, price_per_item: Money.new(2000, "USD"))
    create(:ticket, user_con_profile: ann, ticket_type: paid_type, order_entry:)
  end
  let(:zed_ticket) { create(:ticket, user_con_profile: zed, ticket_type: free_type) }
  let(:unticketed) { create(:user_con_profile, convention:, first_name: "Una", last_name: "Unticketed") }
  let(:event) { create(:event, convention:) }

  before do
    staff_position = create(:admin_staff_position, convention:)
    staff_position.user_con_profiles << admin_profile
    ann_ticket
    zed_ticket
    unticketed
    create(:team_member, event:, user_con_profile: zed)
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil)
    Tables::UserConProfilesTableResultsPresenter.for_convention(
      convention,
      pundit_user,
      filters,
      sort,
      visible_field_ids
    )
  end

  def ids_for(*profiles)
    profiles.map(&:id).sort
  end

  it "filters by name, first name, last name, and email" do
    assert_equal [ann.id], filtered_ids(:name, "aardvark")
    assert_equal [zed.id], filtered_ids(:first_name, "zed")
    assert_equal [ann.id], filtered_ids(:last_name, "aard")
    assert_equal [zed.id], filtered_ids(:email, "EXAMPLE.NET")
  end

  it "filters by ticket type, including attendees without a ticket" do
    assert_equal [ann.id], filtered_ids(:ticket, [paid_type.id.to_s])
    assert_equal [unticketed.id, admin_profile.id].sort, filtered_ids(:ticket_type, ["none"]).sort
    assert_equal [zed.id], filtered_ids(:ticket_type, [free_type.id.to_s])
  end

  it "filters by whether the attendee has a ticket" do
    assert_equal ids_for(ann, zed), filtered_ids(:attending, true).sort
    assert_equal ids_for(unticketed, admin_profile), filtered_ids(:attending, false).sort
  end

  it "filters by payment amount" do
    assert_equal [ann.id], filtered_ids(:payment_amount, "20")
    assert_includes filtered_ids(:payment_amount, "0"), zed.id
  end

  it "filters by team member status" do
    assert_equal [zed.id], filtered_ids(:is_team_member, true)
    assert_not_includes filtered_ids(:is_team_member, false), zed.id
  end

  it "filters by privileges" do
    admin_profile.user.update!(site_admin: true)

    assert_equal [admin_profile.id], filtered_ids(:privileges, ["site_admin"])
    assert_equal build_presenter.scoped.map(&:id).sort, filtered_ids(:privileges, []).sort
  end

  it "sorts by name, first name, last name, email, ticket, and ticket update time" do
    assert_equal([ann.id, zed.id], sorted_ids(:name).select { |id| [ann.id, zed.id].include?(id) })
    assert_equal([zed.id, ann.id], sorted_ids(:last_name, desc: true).select { |id| [ann.id, zed.id].include?(id) })
    assert_equal([ann.id, zed.id], sorted_ids(:first_name).select { |id| [ann.id, zed.id].include?(id) })
    assert_equal([ann.id, zed.id], sorted_ids(:email).select { |id| [ann.id, zed.id].include?(id) })
    assert_sortable(:ticket, :ticket_type, :ticket_updated_at)
  end

  it "exports tickets, payment, and team member status as CSV" do
    columns = %w[name email ticket ticket_type payment_amount is_team_member attending ticket_updated_at privileges]
    rows = csv_rows(columns)
    ann_row = rows.find { |row| row.first == "Aardvark, Ann" }
    zed_row = rows.find { |row| row.first == "Zebra, Zed" }
    unticketed_row = rows.find { |row| row.first == "Unticketed, Una" }

    assert_equal ["Name", "Email", "Ticket", "Ticket type", "Payment amount", "Event team member?", "Attending?"],
                 rows.first.first(7)
    assert_equal ["ann@example.com", "Paid $20", "Paid", "20.0", "no", "yes"], ann_row.drop(1).first(6)
    assert_equal ["zed@example.net", "Free", "Free", nil, "yes", "yes"], zed_row.drop(1).first(6)
    assert_equal "Unpaid", unticketed_row.third
    assert_equal "no", unticketed_row[6]
  end

  describe "without permission to read tickets" do
    let(:reader_profile) { create(:user_con_profile, convention:) }
    let(:pundit_user) { AuthorizationInfo.cast(reader_profile.user) }

    before do
      staff_position = create(:staff_position, convention:, user_con_profiles: [reader_profile])
      staff_position.permissions.create!(model: convention, permission: "read_user_con_profiles")
    end

    it "ignores ticket filters and sorts" do
      all_ids = build_presenter.scoped.map(&:id).sort

      assert_equal all_ids, filtered_ids(:ticket, [paid_type.id.to_s]).sort
      assert_equal all_ids, filtered_ids(:attending, true).sort
      assert_equal all_ids, filtered_ids(:payment_amount, "20").sort
      assert_equal all_ids, sorted_ids(:ticket).sort
    end
  end

  describe ".describe_ticket" do
    it "describes tickets with and without payment amounts" do
      assert_equal "Unpaid", Tables::UserConProfilesTableResultsPresenter.describe_ticket(nil)
      assert_equal "Paid $20", Tables::UserConProfilesTableResultsPresenter.describe_ticket(ann_ticket)
      assert_equal "Paid",
                   Tables::UserConProfilesTableResultsPresenter.describe_ticket(
                     ann_ticket,
                     include_payment_amount: false
                   )
      assert_equal "Free", Tables::UserConProfilesTableResultsPresenter.describe_ticket(zed_ticket)
    end
  end

  describe "form items" do
    let(:site_admin) { create(:site_admin) }
    let(:convention) { create(:convention) }
    let(:user_con_profile) { create(:user_con_profile, convention:, additional_info: { "pronouns" => "they/them" }) }

    before do
      form = create(:user_con_profile_form, convention:)
      convention.update!(user_con_profile_form: form)
      section = form.form_sections.create!(title: "Section")
      section.form_items.create!(
        item_type: "free_text",
        identifier: "pronouns",
        admin_description: "Pronouns (admin)",
        properties: {
          "lines" => 1,
          "caption" => "Pronouns"
        }
      )
      section.form_items.create!(
        item_type: "free_text",
        identifier: "email",
        properties: {
          "lines" => 1,
          "caption" => "Email"
        }
      )
      user_con_profile
    end

    def presenter_for(visible_field_ids, filters: {})
      Tables::UserConProfilesTableResultsPresenter.for_convention(
        convention,
        site_admin,
        filters,
        [],
        visible_field_ids
      )
    end

    def csv_rows(presenter)
      CSV.parse(presenter.csv_enumerator.to_a.join)
    end

    it "exports form items addressed by path, with admin descriptions as headers" do
      rows = csv_rows(presenter_for(%w[form_items.pronouns]))

      assert_equal ["Pronouns (admin)"], rows.first
      assert_equal ["they/them"], rows.drop(1).flatten.compact
    end

    it "does not export form items that correspond to built-in columns through the form items field" do
      rows = csv_rows(presenter_for(%w[form_items.email]))

      assert_empty rows.drop(1).flatten.compact
    end

    it "filters by form item values" do
      matching = presenter_for(nil, filters: { "form_items" => { "pronouns" => ["they/them"] } }).scoped
      other = presenter_for(nil, filters: { "form_items" => { "pronouns" => ["she/her"] } }).scoped

      assert_equal [user_con_profile.id], matching.map(&:id)
      assert_empty other
    end
  end
end
