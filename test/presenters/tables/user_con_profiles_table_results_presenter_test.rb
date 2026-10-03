# frozen_string_literal: true
require "test_helper"

class Tables::UserConProfilesTableResultsPresenterTest < ActiveSupport::TestCase
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
    Tables::UserConProfilesTableResultsPresenter.for_convention(convention, site_admin, filters, [], visible_field_ids)
  end

  def csv_rows(presenter)
    CSV.parse(presenter.csv_enumerator.to_a.join)
  end

  it "exports form items addressed by path, with admin descriptions as headers" do
    rows = csv_rows(presenter_for(%w[form_items.pronouns]))

    assert_equal ["Pronouns (admin)"], rows.first
    assert_equal ["they/them"], rows.second
  end

  it "does not export form items that correspond to built-in columns through the form items field" do
    rows = csv_rows(presenter_for(%w[form_items.email]))

    assert_nil rows.second.first
  end

  it "filters by form item values" do
    matching = presenter_for(nil, filters: { "form_items" => { "pronouns" => ["they/them"] } }).scoped
    other = presenter_for(nil, filters: { "form_items" => { "pronouns" => ["she/her"] } }).scoped

    assert_equal [user_con_profile.id], matching.map(&:id)
    assert_empty other
  end
end
