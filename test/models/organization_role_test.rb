# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: organization_roles
#
#  id              :bigint           not null, primary key
#  name            :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  organization_id :bigint
#
# Indexes
#
#  index_organization_roles_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class OrganizationRoleTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end