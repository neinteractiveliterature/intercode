class Types::NotificationSourceType < Types::BaseUnion
  possible_types Types::UserActivityAlertType

  def self.resolve_type(object, _context)
    case object
    when UserActivityAlert then Types::UserActivityAlertType
    end
  end
end
