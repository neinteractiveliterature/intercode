class Types::PermissionedModelType < Types::BaseUnion
  possible_types Types::ConventionType, Types::EventCategoryType

  def self.resolve_type(object, _context)
    case object
    when Convention then Types::ConventionType
    when EventCategory then Types::EventCategoryType
    end
  end
end
