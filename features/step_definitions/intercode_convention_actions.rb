def create_test_convention
  @test_convention ||= { :title => 'Cucumber Convention',
                         :domain => 'cucumber.convention'}
end

def find_convention
  @convention ||= Convention.first conditions: {:domain => @test_convention[:domain]}
end

def create_convention
  create_test_convention
  delete_convention
  @convention = FactoryGirl.create(:convention, domain: @test_convention[:domain])
end

def delete_convention
  @convention ||= Convention.find_by domain: @test_convention[:domain]
  @convention.destroy unless @convention.nil?
end

def change_dates(start_date, end_date)
  @convention.update_attributes start_date: start_date, end_date: end_date
end

Given(/^There is a convention$/) do
  create_convention
end

And(/^I fill "([^"]*)" as Convention Name$/) do |name|
  @name = name
  fill_in 'Name', :with => name
end

And(/^I fill "([^"]*)" as Convention Domain$/) do |domain|
  fill_in 'Domain', :with => domain
end

And(/^This convention occurred in the past$/) do
  @date = Date.today - 1.year
  change_dates(@date, @date + 1.day)
end

And(/^This convention occurs today$/) do
  @date = Date.today
  change_dates(@date, @date + 1.day)
end

And(/^This convention occurs in the future$/) do
  @date = Date.today + 1.year
  change_dates(@date, @date + 1.day)
end

And(/^This convention has no dates$/) do
  change_dates(nil, nil)
end

When(/^I create a convention$/) do
  pending
end

When(/^I disable a convention$/) do
  pending
end

When(/^I edit a conventions properties$/) do
  pending
end
