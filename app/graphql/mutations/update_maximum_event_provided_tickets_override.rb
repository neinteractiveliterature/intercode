# frozen_string_literal: true
class Mutations::UpdateMaximumEventProvidedTicketsOverride < Mutations::BaseMutation
  field :maximum_event_provided_tickets_override, Types::MaximumEventProvidedTicketsOverrideType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :override_value, Integer, required: true, camelize: false

  load_and_authorize_model_with_id MaximumEventProvidedTicketsOverride, :id, :update

  def resolve(**args)
    maximum_event_provided_tickets_override.update!(override_value: args[:override_value])

    { maximum_event_provided_tickets_override: maximum_event_provided_tickets_override }
  end
end
