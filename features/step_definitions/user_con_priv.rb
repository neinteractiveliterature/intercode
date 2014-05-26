def create_test_account
  @account ||= { :first_name => 'Test',
                 :last_name => 'User',
                 :email => 'test_user@example.com',
                 :password => 'changeme',
                 :password_confirmation => 'changeme' }
end

def find_user
  @user ||= User.first conditions: {:email => @account[:email]}
end

def create_convention_user
  create_test_account
  delete_user
  @user = FactoryGirl.create(:user_con_profile, email: @account[:email])
end

def create_global_admin
  create_test_account
  delete_user
  @user = FactoryGirl.create(:global_admin, email: @account[:email])
end

def delete_user
  @user ||= User.find_by email: @account[:email]
  @user.destroy unless @user.nil?
end

def sign_in
  visit '/users/sign_in'
  fill_in "Email", :with => @account[:email]
  fill_in "Password", :with => @account[:password]
  click_button "Sign in"
end


Given(/^I am not convention User$/) do
  pending
end

And(/^I am registered convention User$/) do
  pending
end

Given(/^I am not Alumni$/) do
  pending
end

Given(/^I am Alumni$/) do
  pending
end

Given(/^I am Unpaid$/) do
  pending
end

Given(/^I am Paid$/) do
  pending
end

Given(/^I am Staff$/) do
  pending
end

Given(/^I am Event GM$/) do
  pending
end

Given(/^I am Event Submitter$/) do
  pending
end

Given(/^I am GM Liaison$/) do
  pending
end

Given(/^I am Outreach$/) do
  pending
end

Given(/^I am Bid Committee$/) do
  pending
end

Given(/^I am Bid Chair$/) do
  pending
end

Given(/^I am Scheduling$/) do
  pending
end

Given(/^I am Registration$/) do
  pending
end

Given(/^I am Con Chair$/) do
  pending
end