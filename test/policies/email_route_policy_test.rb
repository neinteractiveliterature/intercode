# frozen_string_literal: true
require "test_helper"

class EmailRoutePolicyTest < ActiveSupport::TestCase
  let(:email_route) { EmailRoute.new(receiver_address: "info@example.com", forward_addresses: ["someone@example.com"]) }
  let(:admin) { create(:user, site_admin: true) }

  %i[read? manage?].each do |action|
    describe "##{action}" do
      it "lets site admins #{action.to_s.chomp("?")} email routes" do
        assert EmailRoutePolicy.new(admin, email_route).public_send(action)
      end

      it "does not let regular users #{action.to_s.chomp("?")} email routes" do
        assert_not EmailRoutePolicy.new(create(:user), email_route).public_send(action)
      end

      it "does not let anonymous users #{action.to_s.chomp("?")} email routes" do
        assert_not EmailRoutePolicy.new(nil, email_route).public_send(action)
      end
    end
  end

  describe "Scope" do
    it "returns all email routes to site admins" do
      assert_equal EmailRoute.all.to_a, EmailRoutePolicy::Scope.new(admin, EmailRoute.all).resolve.to_a
    end

    it "returns nothing to regular users" do
      assert_empty EmailRoutePolicy::Scope.new(create(:user), EmailRoute.all).resolve
    end

    it "returns nothing to anonymous users" do
      assert_empty EmailRoutePolicy::Scope.new(nil, EmailRoute.all).resolve
    end
  end
end
