# frozen_string_literal: true
class Mutations::UpdateMaximumEventProvidedTicketsOverride < Mutations::BaseMutation
  field :maximum_event_provided_tickets_override, Types::MaximumEventProvidedTicketsOverrideType, null: false

  argument :id, ID, required: false
  argument :override_value, Integer, required: true, camelize: false

  load_and_authorize_model_with_id MaximumEventProvidedTicketsOverride, :id, :update

  def resolve(**args)
    maximum_event_provided_tickets_override.update!(override_value: args[:override_value])

    { maximum_event_provided_tickets_override: maximum_event_provided_tickets_override }
  end
end
