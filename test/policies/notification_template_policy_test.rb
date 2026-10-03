# frozen_string_literal: true
require "test_helper"
require_relative "convention_permissions_test_helper"

class NotificationTemplatePolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention, :with_notification_templates) }
  let(:notification_template) { convention.notification_templates.first }

  describe "#read?" do
    it "lets users with read_notification_templates read notification templates" do
      user = create_user_with_read_notification_templates_in_convention(convention)
      assert_policy_allows NotificationTemplatePolicy, user, notification_template, :read?, convention
    end

    it "does not let users with only update_notification_templates read them" do
      user = create_user_with_update_notification_templates_in_convention(convention)
      assert_not NotificationTemplatePolicy.new(user, notification_template).read?
    end

    it "does not let users with read_notification_templates in another convention read them" do
      user = create_user_with_read_notification_templates_in_convention(create(:convention))
      assert_not NotificationTemplatePolicy.new(user, notification_template).read?
    end

    it "does not let regular users read notification templates" do
      assert_not NotificationTemplatePolicy.new(
                   create(:user_con_profile, convention:).user,
                   notification_template
                 ).read?
    end

    it "lets site admins read notification templates" do
      assert NotificationTemplatePolicy.new(create(:user, site_admin: true), notification_template).read?
    end
  end

  describe "#manage?" do
    it "lets users with update_notification_templates manage notification templates" do
      user = create_user_with_update_notification_templates_in_convention(convention)
      assert_policy_allows NotificationTemplatePolicy, user, notification_template, :manage?, convention
    end

    it "does not let users with only read_notification_templates manage them" do
      user = create_user_with_read_notification_templates_in_convention(convention)
      assert_not NotificationTemplatePolicy.new(user, notification_template).manage?
    end

    it "does not let regular users manage notification templates" do
      assert_not NotificationTemplatePolicy.new(create(:user), notification_template).manage?
    end

    it "lets site admins manage notification templates" do
      assert NotificationTemplatePolicy.new(create(:user, site_admin: true), notification_template).manage?
    end
  end

  describe "Scope" do
    it "returns templates in conventions where you can read them" do
      other_convention = create(:convention, :with_notification_templates)
      user = create_user_with_read_notification_templates_in_convention(convention)

      resolved = NotificationTemplatePolicy::Scope.new(user, NotificationTemplate.all).resolve

      assert_equal convention.notification_templates.to_a.sort, resolved.to_a.sort
      assert_empty resolved.where(convention: other_convention)
    end

    it "returns nothing to regular users" do
      convention
      assert_equal [], NotificationTemplatePolicy::Scope.new(create(:user), NotificationTemplate.all).resolve.to_a
    end

    it "returns everything to site admins" do
      convention
      resolved =
        NotificationTemplatePolicy::Scope.new(create(:user, site_admin: true), NotificationTemplate.all).resolve
      assert_equal NotificationTemplate.all.to_a.sort, resolved.to_a.sort
    end
  end
end
