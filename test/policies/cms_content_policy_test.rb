require 'test_helper'
require_relative 'convention_permissions_test_helper'

class CmsContentPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  %i[
    cms_content_group
    cms_file
    cms_graphql_query
    cms_layout
    cms_navigation_item
    cms_partial
    cms_variable
    page
  ].each do |cms_model_name|
    model_class = cms_model_name.to_s.camelize.safe_constantize
    policy_finder = Pundit::PolicyFinder.new(model_class)
    policy_class = policy_finder.policy!
    scope_class = policy_finder.scope!

    describe model_class.name do
      describe '#read?' do
        it "lets anyone read any #{cms_model_name}" do
          model = create(cms_model_name)
          assert policy_class.new(nil, model).read?
        end
      end

      describe '#manage?' do
        it "lets users with update_cms_content manage #{cms_model_name.to_s.pluralize}" do
          model = create(cms_model_name)
          user = create_user_with_update_cms_content_in_convention(model.parent)
          assert policy_class.new(user, model).manage?
        end

        it "does not let users without update_cms_content manage #{cms_model_name.to_s.pluralize}" do
          model = create(cms_model_name)
          user_con_profile = create(:user_con_profile, convention: model.parent)
          refute policy_class.new(user_con_profile.user, model).manage?
        end
      end

      describe 'Scope' do
        it "always returns all #{cms_model_name.to_s.pluralize}" do
          create_list(cms_model_name, 3)
          assert_equal 3, scope_class.new(nil, model_class.all).resolve.count
        end
      end
    end
  end

  %i[
    cms_layout
    cms_partial
    page
  ].each do |cms_model_name|
    model_class = cms_model_name.to_s.camelize.safe_constantize
    policy_finder = Pundit::PolicyFinder.new(model_class)
    policy_class = policy_finder.policy!

    it "lets users with update_content manage #{cms_model_name.to_s.pluralize} in the group" do
      model = create(cms_model_name)
      content_group = create(:cms_content_group, parent: model.parent)
      content_group.cms_content_group_associations.create!(content: model)
      user = create_user_with_update_content_in_cms_content_group(content_group)
      assert policy_class.new(user, model).manage?
    end
  end
end
