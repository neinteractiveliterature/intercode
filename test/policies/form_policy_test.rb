require 'test_helper'
require_relative 'convention_permissions_test_helper'

class FormPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  describe '#read?' do
    it 'lets anyone read any form' do
      form = create(:event_form)
      assert FormPolicy.new(nil, form).read?
    end
  end

  describe '#manage?' do
    it 'lets users with update_forms manage forms' do
      form = create(:event_form)
      user = create_user_with_update_forms_in_convention(form.convention)
      assert FormPolicy.new(user, form).manage?
    end

    it 'does not let users without update_forms manage forms' do
      form = create(:event_form)
      user_con_profile = create(:user_con_profile, convention: form.convention)
      refute FormPolicy.new(user_con_profile.user, form).manage?
    end
  end

  describe 'Scope' do
    it 'always returns all forms' do
      create_list(:event_form, 3)
      assert_equal 3, FormPolicy::Scope.new(nil, Form.all).resolve.count
    end
  end
end
