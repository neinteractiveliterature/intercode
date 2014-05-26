When(/^I am on the convention homepage$/) do
  visit "/"
end

Then(/^I should see the convention name$/) do
  expect(page).to have_content @test_convention[:title]
end