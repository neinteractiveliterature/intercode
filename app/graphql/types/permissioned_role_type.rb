# frozen_string_literal: true
class Types::PermissionedRoleType < Types::BaseUnion
  possible_types Types::StaffPositionType, Types::OrganizationRoleType

  def self.resolve_type(object, _context)
    case object
    when StaffPosition
      Types::StaffPositionType
    when OrganizationRole
      Types::OrganizationRoleType
    end
  end
end
