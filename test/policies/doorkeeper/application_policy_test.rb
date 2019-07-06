require 'test_helper'

class Doorkeeper::ApplicationPolicyTest < ActiveSupport::TestCase
  %w[read manage].each do |action|
    describe "##{action}?" do
      let(:application) { create(:doorkeeper_application) }

      it "lets site admins #{action}" do
        user = create(:user, site_admin: true)
        assert Doorkeeper::ApplicationPolicy.new(user, application).read?
      end

      it "does not let site admins #{action} if they have a doorkeeper_token" do
        user = create(:user, site_admin: true)
        # not bothering to create a real Doorkeeper::OAuth::Token instance since we just check
        # for existence
        pundit_user = AuthorizationInfo.new(user, {})

        refute Doorkeeper::ApplicationPolicy.new(pundit_user, application).read?
      end

      it "does not let anyone else #{action}" do
        user = create(:user)
        refute Doorkeeper::ApplicationPolicy.new(user, application).read?
      end
    end
  end

  describe 'Scope' do
    let(:applications) { create_list(:doorkeeper_application, 3) }
    before { applications }

    it 'returns all applications for site admins' do
      user = create(:user, site_admin: true)
      resolved_applications = Doorkeeper::ApplicationPolicy::Scope.new(
        user, Doorkeeper::Application.all
      ).resolve

      assert_equal applications.sort, resolved_applications.sort
    end

    it 'returns no applications for site admins with a doorkeeper_token' do
      user = create(:user, site_admin: true)
      # not bothering to create a real Doorkeeper::OAuth::Token instance since we just check
      # for existence
      pundit_user = AuthorizationInfo.new(user, {})

      resolved_applications = Doorkeeper::ApplicationPolicy::Scope.new(
        pundit_user, Doorkeeper::Application.all
      ).resolve

      assert_equal [], resolved_applications.sort
    end

    it 'returns no applications for anyone else' do
      user = create(:user)
      resolved_applications = Doorkeeper::ApplicationPolicy::Scope.new(
        user, Doorkeeper::Application.all
      ).resolve

      assert_equal [], resolved_applications.sort
    end
  end
end
