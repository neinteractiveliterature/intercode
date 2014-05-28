def create_default_convention_account
  @account ||= { :first_name => 'Convention',
                 :last_name => 'User',
                 :email => 'convention_user@example.com',
                 :password => 'changeme',
                 :password_confirmation => 'changeme' }
end

def find_user
  @user ||= User.first conditions: {:email => @account[:email]}
end

def create_convention_user
  create_default_convention_account
  delete_user
end

def delete_user
  @user ||= User.find_by email: @account[:email]
  @user.destroy unless @user.nil?
end

def sign_in
  visit '/users/sign_in'
  fill_in 'Email', :with => @account[:email]
  fill_in 'Password', :with => @account[:password]
  click_button 'Sign in'
end

def sign_out
  visit '/users/sign_out'
end

Given(/^I am not convention User$/) do
  sign_out
end

And(/^I am registered convention User$/) do
  create_convention_user
  FactoryGirl.create(:user_con_profile, @user, @convention)
  sign_in
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
  create_convention_user
  @user = FactoryGirl.create(:user_con_profile, :staff, @user, @convention)
  sign_in
end

Given(/^I am not Staff$/) do

end

Given(/^I am Event GM$/) do
  pending
end

Given(/^I am not Event GM$/) do
  pending
end

Given(/^I am Event Submitter$/) do
  pending
end

Given(/^I am not Event Submitter$/) do
  pending
end

Given(/^I am GM Liaison$/) do
  create_convention_user
  @user = FactoryGirl.create(:gm_liason, email: @account[:email])
  sign_in

end

Given(/^I am Outreach$/) do
  create_convention_user
  @user = FactoryGirl.create(:outreach, email: @account[:email])
  sign_in
end

Given(/^I am Bid Committee$/) do
  create_convention_user
  @user = FactoryGirl.create(:bid_committee, email: @account[:email])
  sign_in

end

Given(/^I am Bid Chair$/) do
  create_convention_user
  @user = FactoryGirl.create(:bid_chair, email: @account[:email])
  sign_in
end

Given(/^I am Scheduling$/) do
  create_convention_user
  @user = FactoryGirl.create(:scheduling, email: @account[:email])
  sign_in
end

Given(/^I am Registration$/) do
  create_convention_user
  @user = FactoryGirl.create(:registration, email: @account[:email])
  sign_in
end

Given(/^I am Con Chair$/) do
  create_convention_user
  @user = FactoryGirl.create(:con_chair, email: @account[:email])
  sign_in
end

