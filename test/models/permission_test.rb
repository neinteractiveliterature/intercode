# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: permissions
#
#  id                   :bigint           not null, primary key
#  permission           :string           not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  cms_content_group_id :bigint
#  convention_id        :bigint
#  event_category_id    :bigint
#  organization_role_id :bigint
#  staff_position_id    :bigint
#
# Indexes
#
#  idx_permissions_unique_join                (staff_position_id,permission,event_category_id) UNIQUE
#  index_permissions_on_cms_content_group_id  (cms_content_group_id)
#  index_permissions_on_convention_id         (convention_id)
#  index_permissions_on_event_category_id     (event_category_id)
#  index_permissions_on_organization_role_id  (organization_role_id)
#  index_permissions_on_staff_position_id     (staff_position_id)
#
# Foreign Keys
#
#  fk_rails_...  (cms_content_group_id => cms_content_groups.id)
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (event_category_id => event_categories.id)
#  fk_rails_...  (organization_role_id => organization_roles.id)
#  fk_rails_...  (staff_position_id => staff_positions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class PermissionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
