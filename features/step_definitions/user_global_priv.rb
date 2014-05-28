def create_default_account
  @account ||= { :first_name => 'Default',
                 :last_name => 'User',
                 :email => 'default_user@example.com',
                 :password => 'changeme',
                 :password_confirmation => 'changeme' }
end

def create_global_user
  create_default_account
  delete_user
  @user = FactoryGirl.create(:user, email: @account[:email])
end

def create_global_admin
  create_default_account
  delete_user
  @user = FactoryGirl.create(:user, :global_admin, email: @account[:email])
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

Given(/^I am a Global User$/) do
  create_global_user
  sign_in
end

Given(/^I am a Global Admin$/) do
  create_global_admin
  sign_in
end
