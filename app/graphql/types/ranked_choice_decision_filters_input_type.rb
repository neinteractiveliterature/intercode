# frozen_string_literal: true
class Types::RankedChoiceDecisionFiltersInputType < Types::BaseInputObject
  argument :decisions, [Types::RankedChoiceDecisionValueType], required: false
  argument :reasons, [Types::RankedChoiceDecisionReasonType], required: false
end
