# frozen_string_literal: true
require "application_system_test_case"

# The route guards (app/javascript/routeGuards.ts) have to show the app's own error pages on a full page load, not React
# Router's "Application Error" screen, so these visit the guarded pages directly. Runs in both the data-mode and
# framework-mode system test runs.
class RouteGuardsTest < ApplicationSystemTestCase
  let(:root_site) { create(:root_site) }
  let(:convention) { create(:convention, :with_standard_content) }

  before do
    root_site
    Intercode.overridden_virtual_host_domain = convention.domain
  end

  after { Intercode.overridden_virtual_host_domain = nil }

  def assert_no_application_error
    assert page.has_no_content?("Application Error")
    assert page.has_no_content?("No result returned from dataStrategy")
  end

  it "asks a signed-out visitor to log in on a login-required page" do
    visit "/my_profile"

    # The login prompt is rendered inside the site layout, so the navigation bar is there
    assert page.has_content?("Log in/sign up")
    assert_no_application_error
  end

  it "shows the profile to a signed-in attendee" do
    sign_in create(:user_con_profile, convention:).user

    visit "/my_profile"
    assert page.has_content?("Email")
    assert_no_application_error
  end

  it "tells an attendee without the ability that they are not authorized" do
    sign_in create(:user_con_profile, convention:).user

    visit "/reports"
    assert page.has_content?("Sorry, your account is not authorized to view this page.")
    assert_no_application_error
  end

  it "lets a site admin through an authorization guard" do
    admin = create(:site_admin)
    create(:user_con_profile, convention:, user: admin)
    sign_in admin

    visit "/reports"
    assert page.has_no_content?("not authorized")
    assert_no_application_error
  end

  it "shows the not-found page when a convention-only page is reached on the wrong kind of site" do
    # /root_site is only for the root site, and this is a convention's site
    visit "/root_site"

    assert page.has_content?("We couldn’t find a page at the location")
    assert_no_application_error
  end
end
