Given(/^I am on the Update User Information page$/) do
  visit edit_user_registration_path(@user)
end

When(/^I enter "([^"]*)" as First Name$/) do |first_name|
  @first_name = first_name
  fill_in 'First Name', with => @first_name
end

When(/^I enter "([^"]*)" as Last Name$/) do |last_name|
  @last_name = last_name
  fill_in 'Last Name', with => @last_name
end

When(/^I enter "([^"]*)" as Email$/) do |email_address|
  @email_address = email_address
  fill_in 'Email', with => @email_address
end

When(/^I enter "([^"]*)" as Nickname$/) do |nickname|
  @nickname = nickname
  fill_in 'Nickname', with => @nickname
end

When(/^I enter "([^"]*)" as Phone Number$/) do |phone|
  @phone = phone
  fill_in 'Phone', with => @phone
end

When(/^I select (.*) as Default Gender$/) do |gender|
  @gender = gender
  choose @gender
end

And(/^I enter my password$/) do
  fill_in 'Password', with => @account.password
end