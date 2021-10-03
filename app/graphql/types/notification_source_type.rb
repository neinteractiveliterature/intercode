# frozen_string_literal: true
class Types::NotificationSourceType < Types::BaseUnion
  possible_types Types::UserActivityAlertType

  def self.resolve_type(object, _context)
    case object
    when UserActivityAlert
      Types::UserActivityAlertType
    end
  end
end
