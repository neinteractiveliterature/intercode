# frozen_string_literal: true
class Mutations::DeleteMaximumEventProvidedTicketsOverride < Mutations::BaseMutation
  field :maximum_event_provided_tickets_override, Types::MaximumEventProvidedTicketsOverrideType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_model_with_id MaximumEventProvidedTicketsOverride, :id, :destroy

  def resolve(**_args)
    maximum_event_provided_tickets_override.destroy!

    { maximum_event_provided_tickets_override: maximum_event_provided_tickets_override }
  end
end
