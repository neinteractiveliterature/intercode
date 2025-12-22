require "application_system_test_case"

class EventPageTest < ApplicationSystemTestCase
  before do
    Intercode.overridden_virtual_host_domain = convention.domain
  end

  after do
    Intercode.overridden_virtual_host_domain = nil
  end

  let(:root_site) { create(:root_site) }
  let(:convention) { create(:convention, :with_standard_content) }
  let(:event_category) { create(:event_category, convention:, event_form: convention.forms.find_by!(title: "Regular event form")) }
  let(:signup_round) { create(:signup_round, convention:, start: 1.day.ago, maximum_event_signups: "unlimited") }
  let(:event) { create(:event, convention:, event_category: convention.event_categories.first) }
  let(:the_run) { create(:run, event:, starts_at: 1.day.from_now) }

  before do
    root_site
    event_category
    signup_round
    the_run
  end

  it "renders the page" do
    visit "/events/#{event.to_param}"
    assert page.has_content?("Log in to sign up for")
    assert page.has_content?(event.title)
  end

  it "lets you sign up" do
    user_con_profile = create(:user_con_profile, convention:)
    sign_in user_con_profile.user

    visit "/events/#{event.to_param}"
    click_button "Sign up now"
    assert page.has_content?("You are signed up.")
  end

  it "lets you withdraw" do
    user_con_profile = create(:user_con_profile, convention:)
    signup = create(:signup, user_con_profile:, run: the_run)
    sign_in user_con_profile.user

    visit "/events/#{event.to_param}"
    click_button "Withdraw"
    check "Yes, I’m sure I want to withdraw my confirmed signup from #{event.title}."
    click_button "Confirm"
    assert page.has_content?("Sign up now")
  end
end
