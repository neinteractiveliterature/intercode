# frozen_string_literal: true
require "application_system_test_case"

# The real OAuth sign-in round trip (PKCE redirect, Devise sign-in page, callback, refresh cookie), as opposed to the
# Warden `sign_in` helper the other system tests use. Runs in both the data-mode and framework-mode system test runs.
class AuthenticationTest < ApplicationSystemTestCase
  let(:root_site_layout) do
    create(:cms_layout, parent: nil, content: Rails.root.join("cms_content_sets/root_site/layouts/Default.liquid").read)
  end
  let(:root_site) { create(:root_site, default_layout: root_site_layout) }
  let(:user) { create(:user, password: "correct horse battery staple") }
  let(:frontend_app) { create(:oauth_application, is_intercode_frontend: true, confidential: false) }

  # The OAuth flow redirects the browser to the issuer and back to /oauth/callback, and Doorkeeper only accepts a
  # non-https redirect for localhost, so the test server is reached as localhost and told that is its own address.
  let(:origin) { "http://localhost:#{Capybara.current_session.server.port}" }
  let(:app_url_options) { { host: "localhost", port: Capybara.current_session.server.port, protocol: "http" } }

  before do
    root_site
    frontend_app

    @original_url_options = Rails.application.config.action_mailer.default_url_options
    Rails.application.config.action_mailer.default_url_options = app_url_options
    callback_uri = "#{origin}/oauth/callback"
    @original_redirect_uri = OAuthApplication.instance_method(:redirect_uri)
    OAuthApplication.define_method(:redirect_uri) { callback_uri }
  end

  after do
    Rails.application.config.action_mailer.default_url_options = @original_url_options
    OAuthApplication.define_method(:redirect_uri, @original_redirect_uri)
  end

  def sign_in_through_oauth
    visit "#{origin}/"
    click_button "Log in/sign up"
    click_button "Log in"

    fill_in "user_email", with: user.email
    fill_in "user_password", with: "correct horse battery staple"
    click_button "Log in"

    assert_current_path "/"
    assert page.has_css?("button[aria-label='User options']")
  end

  # The sign-in page only exists on the root site, so that is where the whole round trip is run
  it "signs in through the OAuth flow and comes back to the page the visitor was on" do
    sign_in_through_oauth

    assert page.has_no_button?("Log in/sign up")
  end

  it "stays signed in across a page load, using the refresh cookie" do
    sign_in_through_oauth

    visit "#{origin}/"
    assert page.has_css?("button[aria-label='User options']")
    assert page.has_no_button?("Log in/sign up")
  end

  it "signs out, and stays signed out across a page load" do
    sign_in_through_oauth

    find("button[aria-label='User options']").click
    click_button "Log out"
    assert page.has_button?("Log in/sign up")

    visit "#{origin}/"
    assert page.has_button?("Log in/sign up")
    assert page.has_no_css?("button[aria-label='User options']")
  end

  # The Devise pages send the CSRF token the root loader put in AuthenticityTokensContext
  it "submits a form with an authenticity token" do
    visit "#{origin}/users/password/new"
    fill_in "Email", with: user.email
    click_button "Send instructions"

    assert page.has_content?("Please check your email")
    assert_equal(1, ActionMailer::Base.deliveries.count { |mail| mail.to == [user.email] })
  end
end
