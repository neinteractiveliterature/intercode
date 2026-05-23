# frozen_string_literal: true
require "test_helper"
require_relative "convention_permissions_test_helper"

class RootSitePolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  FakeToken =
    Struct.new(:scopes) do
      def self.with_scopes(*scopes)
        new(Doorkeeper::OAuth::Scopes.from_array(scopes.map(&:to_s)))
      end
    end

  let(:root_site) { create(:root_site) }

  describe "#read?" do
    it "lets anyone read the root site" do
      assert RootSitePolicy.new(nil, root_site).read?
    end
  end

  describe "#manage?" do
    it "lets site admins manage the root site with no token" do
      user = create(:user, site_admin: true)
      assert RootSitePolicy.new(user, root_site).manage?
      assert_not RootSitePolicy.new(create_identity_assumer(user, create(:convention)), root_site).manage?
    end

    it "lets site admins manage the root site with a manage_intercode token" do
      user = create(:user, site_admin: true)
      pundit_user = AuthorizationInfo.new(user, FakeToken.with_scopes(:manage_intercode))
      assert RootSitePolicy.new(pundit_user, root_site).manage?
    end

    it "does not let site admins manage the root site with a token lacking manage_intercode" do
      user = create(:user, site_admin: true)
      pundit_user = AuthorizationInfo.new(user, FakeToken.with_scopes(:public))
      assert_not RootSitePolicy.new(pundit_user, root_site).manage?
    end

    it "does not let non-admins manage the root site" do
      user = create(:user)
      assert_not RootSitePolicy.new(user, root_site).manage?
    end
  end

  describe "Scope" do
    it "returns the root site" do
      resolved_root_sites = RootSitePolicy::Scope.new(nil, RootSite.all).resolve
      assert_equal [root_site], resolved_root_sites.sort
    end
  end
end
