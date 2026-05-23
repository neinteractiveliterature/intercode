require "test_helper"

class OAuthApplicationPolicyTest < ActiveSupport::TestCase
  FakeToken =
    Struct.new(:scopes) do
      def self.with_scopes(*scopes)
        new(Doorkeeper::OAuth::Scopes.from_array(scopes.map(&:to_s)))
      end
    end

  %w[read manage].each do |action|
    describe "##{action}?" do
      let(:application) { create(:oauth_application) }

      it "lets site admins #{action} with no token" do
        user = create(:user, site_admin: true)
        assert OAuthApplicationPolicy.new(user, application).send(:"#{action}?")
      end

      it "lets site admins #{action} with a manage_intercode token" do
        user = create(:user, site_admin: true)
        pundit_user = AuthorizationInfo.new(user, FakeToken.with_scopes(:manage_intercode))
        assert OAuthApplicationPolicy.new(pundit_user, application).send(:"#{action}?")
      end

      it "does not let site admins #{action} with a token lacking manage_intercode" do
        user = create(:user, site_admin: true)
        pundit_user = AuthorizationInfo.new(user, FakeToken.with_scopes(:public))
        refute OAuthApplicationPolicy.new(pundit_user, application).send(:"#{action}?")
      end

      it "does not let anyone else #{action}" do
        user = create(:user)
        refute OAuthApplicationPolicy.new(user, application).send(:"#{action}?")
      end
    end
  end

  describe "Scope" do
    let(:applications) { create_list(:oauth_application, 3) }
    before { applications }

    it "returns all applications for site admins with no token" do
      user = create(:user, site_admin: true)
      resolved_applications = OAuthApplicationPolicy::Scope.new(user, OAuthApplication.all).resolve

      assert_equal applications.sort, resolved_applications.sort
    end

    it "returns all applications for site admins with a manage_intercode token" do
      user = create(:user, site_admin: true)
      pundit_user = AuthorizationInfo.new(user, FakeToken.with_scopes(:manage_intercode))

      resolved_applications = OAuthApplicationPolicy::Scope.new(pundit_user, OAuthApplication.all).resolve

      assert_equal applications.sort, resolved_applications.sort
    end

    it "returns no applications for site admins with a token lacking manage_intercode" do
      user = create(:user, site_admin: true)
      pundit_user = AuthorizationInfo.new(user, FakeToken.with_scopes(:public))

      resolved_applications = OAuthApplicationPolicy::Scope.new(pundit_user, OAuthApplication.all).resolve

      assert_equal [], resolved_applications.sort
    end

    it "returns no applications for anyone else" do
      user = create(:user)
      resolved_applications = OAuthApplicationPolicy::Scope.new(user, OAuthApplication.all).resolve

      assert_equal [], resolved_applications.sort
    end
  end
end
