# frozen_string_literal: true
require "test_helper"

class PasswordsControllerTest < ActionDispatch::IntegrationTest
  it "serves the app shell for the forgot password page" do
    create(:root_site)

    get new_user_password_path

    assert_response :success
    assert_select "form", false
  end

  it "serves the app shell for the reset password page instead of Devise's default form" do
    create(:root_site)

    get edit_user_password_path(reset_password_token: "sometoken")

    assert_response :success
    assert_select "form", false
  end
end
