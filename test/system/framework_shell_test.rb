# frozen_string_literal: true
require "application_system_test_case"

# Boots the framework-mode build in a real browser, with Rails serving the prebuilt shell (see StaticSpaShell). Run
# script/prepareStaticShell.sh after yarn build:framework, then set STATIC_SHELL_DIR to the directory it prints.
# Skipped without it, so the rest of the system tests keep running against the Rails-rendered shell.
#
# This only covers what the framework build has so far (its placeholder /framework-check page, which runs the
# same bootstrap and AppRoot query as the app); the other system tests will run against it once the routes have moved.
class FrameworkShellTest < ApplicationSystemTestCase
  let(:root_site) { create(:root_site) }
  let(:convention) { create(:convention, :with_standard_content) }

  before do
    skip "Set STATIC_SHELL_DIR to run the framework-mode shell tests" unless StaticSpaShell.enabled?

    root_site
    Intercode.overridden_virtual_host_domain = convention.domain
  end

  after { Intercode.overridden_virtual_host_domain = nil }

  it "boots and shows that nobody is signed in" do
    visit "/framework-check"
    assert page.has_content?("Framework mode")
    assert page.has_content?("Not signed in")
  end

  it "boots with the signed-in user's session" do
    user_con_profile = create(:user_con_profile, convention:)
    sign_in user_con_profile.user

    visit "/framework-check"
    assert page.has_content?("Signed in as #{user_con_profile.user.name}")
  end
end
