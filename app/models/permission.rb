class Permission < ApplicationRecord
  include Concerns::ExclusiveArc

  PERMISSION_NAMES_CONFIG = JSON.parse(File.read(
    File.expand_path('config/permission_names.json', Rails.root)
  ))

  exclusive_arc :role, [StaffPosition, OrganizationRole]
  exclusive_arc :model, [Convention, EventCategory]

  scope :for_user, ->(user) do
    where(
      staff_position: StaffPosition.joins(:user_con_profiles)
        .where(user_con_profiles: { user_id: user.id })
    ).or(
      where(organization_role: OrganizationRole.joins(:users).where(users: { id: user.id }))
    )
  end

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
    permissions.each do |permission|
      create!(role: role, model: model, permission: permission)
    end
  end

  def self.revoke(role, model, *permissions)
    for_role(role).for_model(model).where(permission: permissions).destroy_all
  end
end
