When(/^I create a convention$/) do
  pending
end

When(/^I disable a convention$/) do
  pending
end

When(/^I edit a conventions properties$/) do
  pending
end

Given(/^I am on the Intercode homepage$/) do
  visit "/conventions"
end

Then(/^I am redirected to the convention$/) do
  pending
end

Then(/^The convention redirects to the homepage$/) do
  pending
end

Then(/^I see a list of conventions$/) do
  pending
end

Then(/^Email is sent to all Global Admins$/) do
  pending
end

When(/^I click on "([^"]*)"$/) do |link|
  click_on link
end

And(/^I fill "([^"]*)" as Name$/) do |name|
  @name = name
  fill_in "Name", :with => name
end

And(/^I fill "([^"]*)" as Domain$/) do |domain|
  fill_in "Domain", :with => domain
end

And(/^I click "([^"]*)"$/) do |btn|
  click_button btn
end

Then(/^I should see the convention I created$/) do
  page.should have_content(@name)
end