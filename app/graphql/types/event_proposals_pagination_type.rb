class Types::EventProposalsPaginationType < Types::PaginationType
  entries_field Types::EventProposalType

  def self.authorized?(_value, context)
    Pundit.policy(context[:pundit_user], context[:convention]).view_event_proposals?
  end
end
