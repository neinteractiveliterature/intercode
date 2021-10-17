# frozen_string_literal: true
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

class Permission < ApplicationRecord
  include ExclusiveArc

  PERMISSION_NAMES_CONFIG = JSON.parse(File.read(File.expand_path('config/permission_names.json', Rails.root)))

  exclusive_arc :role, [StaffPosition, OrganizationRole]
  exclusive_arc :model, [CmsContentGroup, Convention, EventCategory]

  scope :for_user,
        ->(user) {
          where(staff_position: StaffPosition.joins(:user_con_profiles).where(user_con_profiles: { user_id: user.id }))
            .or(where(organization_role: OrganizationRole.joins(:users).where(users: { id: user.id })))
        }

  def self.permission_names_for_model_type(model_type)
    PERMISSION_NAMES_CONFIG.flat_map do |permission_set|
      if permission_set['model_type'] == model_type
        permission_set['permissions'].map { |permission_config| permission_config['permission'] }
      else
        []
      end
    end
  end

  def self.grant(role, model, *permissions)
    permissions.each { |permission| create!(role: role, model: model, permission: permission) }
  end

  def self.revoke(role, model, *permissions)
    for_role(role).for_model(model).where(permission: permissions).destroy_all
  end
end
