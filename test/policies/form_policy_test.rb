require 'test_helper'

class FormPolicyTest < ActiveSupport::TestCase
  describe '#read?' do
    it 'lets anyone read any form' do
      form = create(:form)
      assert FormPolicy.new(nil, form).read?
    end
  end

  describe '#manage?' do
    it 'lets con staff manage forms' do
      form = create(:form)
      user_con_profile = create(:staff_user_con_profile, convention: form.convention)
      assert FormPolicy.new(user_con_profile.user, form).manage?
    end

    it 'does not let non-staff manage forms' do
      form = create(:form)
      user_con_profile = create(:user_con_profile, convention: form.convention)
      refute FormPolicy.new(user_con_profile.user, form).manage?
    end
  end

  describe 'Scope' do
    it 'always returns all forms' do
      create_list(:form, 3)
      assert_equal 3, FormPolicy::Scope.new(nil, Form.all).resolve.count
    end
  end
end
