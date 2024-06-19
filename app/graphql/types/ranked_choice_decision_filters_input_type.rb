# frozen_string_literal: true
class Types::RankedChoiceDecisionFiltersInputType < Types::BaseInputObject
  description "Filters that can be applied to a paginated table of RankedChoiceDecisions."

  argument :decision, [Types::RankedChoiceDecisionValueType], required: false do
    description "Filter by the type of decision(s) that were made."
  end
  argument :event_title, String, required: false, camelize: false do
    description "Filter by the title of the event the decisions pertained to."
  end
  argument :reason, [Types::RankedChoiceDecisionReasonType], required: false do
    description "Filter by the reason(s) for the decisions."
  end
  argument :user_con_profile_name, String, required: false, camelize: false do
    description "Filter by the name of the user profiles these decisions pertained to."
  end
end
