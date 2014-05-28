When(/^I click on "([^"]*)"$/) do |link|
  click_on link
end

And(/^I click "([^"]*)"$/) do |btn|
  click_button btn
end

Then(/^I should see "([^"]*)"$/) do |heading|
  expect(page).to have_content(heading)
end

Then(/^I should not see "([^"]*)"$/) do |heading|
  expect(page).not_to have_content(heading)
end

And(/^I am in the sample convention domain$/) do
  step 'There is a sample convention'
  Capybara.app_host = "http://#{@test_convention[:domain]}"
end

