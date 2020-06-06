class Types::SearchableModelType < Types::BaseUnion
  possible_types(
    Types::EventType, Types::EventProposalType, Types::PageType, Types::UserConProfileType
  )

  def self.resolve_type(object, _context)
    case object
    when Event then Types::EventType
    when EventProposal then Types::EventProposalType
    when Page then Types::PageType
    when UserConProfile then Types::UserConProfileType
    end
  end
end
