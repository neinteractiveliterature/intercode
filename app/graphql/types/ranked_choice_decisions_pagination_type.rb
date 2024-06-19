# frozen_string_literal: true
class Types::RankedChoiceDecisionsPaginationType < Types::PaginationType
  description "A paginated table of RankedChoiceDecisions."

  entries_field Types::RankedChoiceDecisionType
end
