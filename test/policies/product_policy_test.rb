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
      assert ProductPolicy.new(user, product).manage?
    end

    it 'does not let users without update_products manage products' do
      product = create(:product)
      user_con_profile = create(:user_con_profile, convention: product.convention)
      refute ProductPolicy.new(user_con_profile.user, product).manage?
    end
  end

  describe 'Scope' do
    it 'always returns all forms' do
      create_list(:product, 3)
      assert_equal 3, ProductPolicy::Scope.new(nil, Product.all).resolve.count
    end
  end
end
