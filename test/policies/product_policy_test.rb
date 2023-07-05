require 'test_helper'
require_relative 'convention_permissions_test_helper'

class ProductPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  describe '#read?' do
    it 'lets anyone read any product' do
      product = create(:product)
      assert ProductPolicy.new(nil, product).read?
    end
  end

  describe '#manage?' do
    it 'lets users with update_products manage products' do
      product = create(:product)
      user = create_user_with_update_products_in_convention(product.convention)
      assert_policy_allows ProductPolicy, user, product, :manage?, product.convention
    end

    it 'does not let users without update_products manage products' do
      product = create(:product)
      user_con_profile = create(:user_con_profile, convention: product.convention)
      refute ProductPolicy.new(user_con_profile.user, product).manage?
    end

    it 'lets team members manage products attached to event-specific ticket types' do
      ticket_type = create(:event_specific_ticket_type)
      product = create(:product, provides_ticket_type: ticket_type, convention: ticket_type.event.convention)
      team_member = create(:team_member, event: ticket_type.event)

      assert_policy_allows ProductPolicy, team_member.user_con_profile.user, product, :manage?, product.convention
    end

    it 'does not let regular users manage products attached to event-specific ticket types' do
      ticket_type = create(:event_specific_ticket_type)
      product = create(:product, provides_ticket_type: ticket_type, convention: ticket_type.event.convention)
      run = create(:run, event: ticket_type.event)
      signup = create(:signup, run: run)

      refute ProductPolicy.new(signup.user_con_profile.user, product).manage?
    end
  end

  describe 'Scope' do
    it 'always returns all products' do
      create_list(:product, 3)
      assert_equal 3, ProductPolicy::Scope.new(nil, Product.all).resolve.count
    end
  end
end
