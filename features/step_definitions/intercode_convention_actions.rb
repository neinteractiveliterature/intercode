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
  @convention = FactoryGirl.create(:convention, title: @test_convention[:title], domain: @test_convention[:domain])
end

def delete_convention
  @convention ||= Convention.find_by domain: @test_convention[:domain]
  @convention.destroy unless @convention.nil?
end

def change_dates(start_date, end_date)
  @convention.update_attributes start_date: start_date, end_date: end_date
end

Given(/^There is a sample convention$/) do
  create_convention
end

And(/^I fill "([^"]*)" as Convention Title$/) do |title|
  @title = title
  fill_in 'Title', :with => title
end

And(/^I fill "([^"]*)" as Convention Domain$/) do |domain|
  @domain = domain
  fill_in 'Domain', :with => domain
end

When(/^I fill (.*) as Convention Start Date$/) do |start_date|
  @start_date = start_date.to_date
  fill_in 'Start date', :with => start_date
end

When(/^I fill (.*) as Convention End Date$/) do |end_date|
  @end_date = end_date.to_date
  fill_in 'End date', :with => end_date
end

When(/^I fill current dates for Start and End Date$/) do
  @start_date = Date.today
  @end_date = Date.today
  fill_in 'Start date', :with => @start_date
  fill_in 'End date', :with => @end_date
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

When(/^I disable a convention$/) do
  pending
end