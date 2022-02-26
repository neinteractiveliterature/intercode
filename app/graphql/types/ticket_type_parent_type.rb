# frozen_string_literal: true
class Types::TicketTypeParentType < Types::BaseUnion
  possible_types Types::ConventionType, Types::EventType

  def self.resolve_type(object, _context)
    case object
    when Convention
      Types::ConventionType
    when Event
      Types::EventType
    end
  end
end
