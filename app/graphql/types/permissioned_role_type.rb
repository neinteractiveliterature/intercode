class Types::PermissionedRoleType < Types::BaseUnion
  possible_types Types::StaffPositionType, Types::OrganizationRoleType

  def self.resolve_type(object, _context)
    case object
    when StaffPosition then Types::StaffPositionType
    when OrganizationRole then Types::OrganizationRoleType
    end
  end
end
