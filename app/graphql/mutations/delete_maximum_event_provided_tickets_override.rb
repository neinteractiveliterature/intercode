# frozen_string_literal: true
class Mutations::DeleteMaximumEventProvidedTicketsOverride < Mutations::BaseMutation
  field :maximum_event_provided_tickets_override, Types::MaximumEventProvidedTicketsOverrideType, null: false

  argument :id, ID, required: false

  load_and_authorize_model_with_id MaximumEventProvidedTicketsOverride, :id, :destroy

  def resolve(**_args)
    maximum_event_provided_tickets_override.destroy!

    { maximum_event_provided_tickets_override: maximum_event_provided_tickets_override }
  end
end
