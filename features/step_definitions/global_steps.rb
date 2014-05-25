When(/^I click on "([^"]*)"$/) do |link|
  click_on link
end

And(/^I click "([^"]*)"$/) do |btn|
  click_button btn
end

Then(/^I should see "([^"]*)"$/) do |heading|
  expect(page).to have_content(heading)
end