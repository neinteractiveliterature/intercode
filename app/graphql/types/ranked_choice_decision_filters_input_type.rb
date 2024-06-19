# frozen_string_literal: true
class Types::RankedChoiceDecisionFiltersInputType < Types::BaseInputObject
  argument :user_con_profile_name, String, required: false, camelize: false
  argument :event_title, String, required: false, camelize: false
  argument :decision, [Types::RankedChoiceDecisionValueType], required: false
  argument :reason, [Types::RankedChoiceDecisionReasonType], required: false
end
