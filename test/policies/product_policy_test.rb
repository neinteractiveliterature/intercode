require 'test_helper'

class ProductPolicyTest < ActiveSupport::TestCase
  describe '#read?' do
    it 'lets anyone read any product' do
      product = FactoryBot.create(:product)
      assert ProductPolicy.new(nil, product).read?
    end
  end

  describe '#manage?' do
    it 'lets con staff manage forms' do
      product = FactoryBot.create(:product)
      user_con_profile = FactoryBot.create(:staff_user_con_profile, convention: product.convention)
      assert ProductPolicy.new(user_con_profile.user, product).manage?
    end

    it 'does not let non-staff manage forms' do
      product = FactoryBot.create(:product)
      user_con_profile = FactoryBot.create(:user_con_profile, convention: product.convention)
      refute ProductPolicy.new(user_con_profile.user, product).manage?
    end
  end

  describe 'Scope' do
    it 'always returns all forms' do
      FactoryBot.create_list(:product, 3)
      assert_equal 3, ProductPolicy::Scope.new(nil, Product.all).resolve.count
    end
  end
end
