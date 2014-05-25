Given(/^I am on the Intercode homepage$/) do
  visit conventions_path
end

Given(/^I am on the Edit Convention page$/) do
  visit edit_convention_path(@convention)
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

And(/^I should see the convention I created$/) do
  convention_url = "http://#{@domain}/"
  expect(page).to have_link(@title,:href => convention_url)
end

And(/^The sample convention is displayed$/) do
  convention_url = "http://#{@test_convention[:domain]}/"
  expect(page).to have_link(@test_convention[:title],:href => convention_url)
end

Then(/^I should be redirected to the Conventions Index$/) do
  expect(current_path).to eq conventions_path
end

And(/^I should see the renamed convention$/) do
  convention_url = "http://#{@test_convention[:domain]}/"
  expect(page).to have_link(@title,:href => convention_url)
end

And(/^I should see the new conventions domain$/) do
  convention_url = "http://#{@domain}/"
  expect(page).to have_link(@test_convention[:title], :href => convention_url)
end