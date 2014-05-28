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

def create_convention_users
  create_test_account
  delete_user
  @user = FactoryGirl.create(:user_con_profile, email: @account[:email])
end

def delete_user
  @user ||= User.find_by email: @account[:email]
  @user.destroy unless @user.nil?
end

Given(/^There is a unpaid user$/) do
  pending
end