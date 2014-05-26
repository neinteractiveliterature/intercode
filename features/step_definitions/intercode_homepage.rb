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

Then(/^I should be redirected to the Conventions Index$/) do
  expect(current_path).to eq conventions_path
end

And(/^I should see the convention I created$/) do
  convention_url = "http://#{@domain}/"
  expect(page).to have_link(@title,:href => convention_url)

  if @start_date && @end_date then
      expect(page).to have_content("#{@start_date.strftime('%m/%d/%Y')} to #{@end_date.strftime('%m/%d/%Y')}")
  end

end

And(/^The sample convention is displayed$/) do
  convention_url = "http://#{@test_convention[:domain]}/"
  expect(page).to have_link(@test_convention[:title],:href => convention_url)
end

And(/^I should see the renamed convention$/) do
  convention_url = "http://#{@test_convention[:domain]}/"
  expect(page).to have_link(@title,:href => convention_url)
end

And(/^I should see the new conventions domain$/) do
  convention_url = "http://#{@domain}/"
  expect(page).to have_link(@test_convention[:title], :href => convention_url)
end

When(/^I should see the dates displayed$/) do
  expect(page).to have_content(@start_date.strftime('%m/%d/%Y'))
  expect(page).to have_content(@end_date.strftime('%m/%d/%Y'))
end

When(/^I should not see the dates$/) do
  expect(page).to have_content("#{@test_convention[:title]} /")
end


Then(/^I should see Edit Convention link$/) do
  expect(page).to have_link('Edit', :href => edit_convention_path(@convention))
end