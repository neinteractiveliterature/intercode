# frozen_string_literal: true
require "test_helper"
require_relative "convention_permissions_test_helper"

# NOTE: DepartmentPolicy checks for read_departments/update_departments convention permissions, but those aren't
# defined in config/permission_names.json, so in practice only site admins can read or manage departments.
class DepartmentPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention) }
  let(:department) { convention.departments.create!(name: "Tabletop") }
  let(:admin) { create(:user, site_admin: true) }
  let(:con_admin) { create_user_with_update_convention_in_convention(convention) }

  %i[read? manage?].each do |action|
    describe "##{action}" do
      it "lets site admins #{action.to_s.chomp("?")} departments" do
        assert DepartmentPolicy.new(admin, department).public_send(action)
      end

      it "does not let convention admins #{action.to_s.chomp("?")} departments" do
        assert_not DepartmentPolicy.new(con_admin, department).public_send(action)
      end

      it "does not let regular users #{action.to_s.chomp("?")} departments" do
        assert_not DepartmentPolicy.new(create(:user_con_profile, convention:).user, department).public_send(action)
      end

      it "does not let anonymous users #{action.to_s.chomp("?")} departments" do
        assert_not DepartmentPolicy.new(nil, department).public_send(action)
      end
    end
  end

  describe "Scope" do
    it "returns everything to site admins" do
      department
      assert_equal [department], DepartmentPolicy::Scope.new(admin, Department.all).resolve.to_a
    end

    it "returns nothing to anyone else" do
      department
      assert_equal [], DepartmentPolicy::Scope.new(con_admin, Department.all).resolve.to_a
      assert_equal [], DepartmentPolicy::Scope.new(nil, Department.all).resolve.to_a
    end
  end
end
