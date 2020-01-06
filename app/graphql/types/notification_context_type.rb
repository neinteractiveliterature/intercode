class Types::NotificationContextType < Types::BaseUnion
  possible_types Types::EventCategoryType

  def self.resolve_type(object, _context)
    case object
    when EventCategory then Types::EventCategoryType
    end
  end
end
