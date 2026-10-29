# frozen_string_literal: true
require "application_system_test_case"

# "Become user" starts from the admin's Rails session, swaps in the other user's session and OAuth refresh cookie, and
# reverts with a bearer token redeemed from that cookie, so this covers the cookie and token paths after a full page
# load. Runs in both the data-mode and framework-mode system test runs.
class AssumedIdentityTest < ApplicationSystemTestCase
  let(:root_site) { create(:root_site) }
  let(:convention) { create(:convention, :with_standard_content) }
  let(:admin) { create(:site_admin) }
  let(:attendee_profile) { create(:user_con_profile, convention:, first_name: "Aaron", last_name: "Attendee") }

  before do
    root_site
    create(:oauth_application, is_intercode_frontend: true, confidential: false)
    create(:user_con_profile, convention:, user: admin, first_name: "Ada", last_name: "Admin")
    attendee_profile
    Intercode.overridden_virtual_host_domain = convention.domain
  end

  after { Intercode.overridden_virtual_host_domain = nil }

  it "becomes another user and reverts back" do
    sign_in admin

    visit "/user_con_profiles/#{attendee_profile.id}"
    click_button "Become user"
    fill_in "Justification", with: "System test"
    within(".modal") { click_button "Become user" }

    # The user menu's toggle is the name of the user being assumed, in the warning colour
    click_button "Aaron Attendee", class: "btn-warning"
    assert page.has_button?("Revert to Ada Admin")

    # Reload so the reverting request has to use the refresh cookie that "become" set
    visit "/"
    click_button "Aaron Attendee", class: "btn-warning"
    click_button "Revert to Ada Admin"
    assert page.has_no_css?("button.btn-warning")
    assert page.has_css?("button[aria-label='User options']")
  end
end
