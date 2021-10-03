# frozen_string_literal: true
class Types::SearchableModelType < Types::BaseUnion
  possible_types(Types::EventType, Types::EventProposalType, Types::PageType, Types::UserConProfileType)

  def self.resolve_type(object, _context)
    case object
    when Event
      Types::EventType
    when EventProposal
      Types::EventProposalType
    when Page
      Types::PageType
    when UserConProfile
      Types::UserConProfileType
    end
  end
end
