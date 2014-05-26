When(/^I click on "([^"]*)"$/) do |link|
  click_on link
end

And(/^I click "([^"]*)"$/) do |btn|
  click_button btn
end

Then(/^I should see "([^"]*)"$/) do |heading|
  expect(page).to have_content(heading)
end

And(/^I am in the sample convention domain$/) do
  Capybara.app_host = "http://#{@test_convention[:domain]}"
end