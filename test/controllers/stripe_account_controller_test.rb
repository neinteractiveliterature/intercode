# frozen_string_literal: true
require "test_helper"

describe StripeAccountController do
  let(:convention) { create(:convention, stripe_account_id: "acct_123", stripe_account_ready_to_charge: false) }
  let(:admin_staff_position) { create(:admin_staff_position, convention:) }
  let(:admin) do
    profile = create(:user_con_profile, convention:)
    admin_staff_position.user_con_profiles << profile
    profile.user
  end
  let(:account) { Struct.new(:id, :charges_enabled).new("acct_123", true) }

  setup { set_convention convention }

  describe "GET return" do
    it "connects the convention's Stripe account and sends the admin back to the payments settings" do
      sign_in admin
      Stripe::Account.stub(:retrieve, ->(id) { id == "acct_123" ? account : flunk("wrong account #{id}") }) do
        Stripe::ApplePayDomain.stub(:create, nil) { get :return }
      end

      assert_redirected_to "/convention/edit#payments"
      assert convention.reload.stripe_account_ready_to_charge
    end

    it "doesn't let regular users connect the account" do
      sign_in create(:user_con_profile, convention:).user

      Stripe::Account.stub(:retrieve, ->(*) { flunk "should not talk to Stripe" }) { get :return }

      assert_not_equal "/convention/edit#payments", response.location
      assert_not convention.reload.stripe_account_ready_to_charge
    end

    it "doesn't let anonymous users connect the account" do
      Stripe::Account.stub(:retrieve, ->(*) { flunk "should not talk to Stripe" }) { get :return }

      assert_not convention.reload.stripe_account_ready_to_charge
    end
  end

  describe "GET refresh" do
    it "sends the admin to a fresh Stripe onboarding link" do
      sign_in admin
      link_params = nil
      link = Struct.new(:url).new("https://connect.stripe.com/setup/onboarding")

      Stripe::AccountLink.stub(:create, ->(params) { (link_params = params) && link }) { get :refresh }

      assert_redirected_to "https://connect.stripe.com/setup/onboarding"
      assert_equal "acct_123", link_params[:account]
      assert_equal "account_onboarding", link_params[:type]
      assert_equal stripe_account_refresh_url, link_params[:refresh_url]
      assert_equal stripe_account_return_url, link_params[:return_url]
    end

    it "doesn't let regular users create onboarding links" do
      sign_in create(:user_con_profile, convention:).user

      Stripe::AccountLink.stub(:create, ->(*) { flunk "should not talk to Stripe" }) { get :refresh }

      assert_not response.redirect? && response.location.start_with?("https://connect.stripe.com")
    end
  end
end
