Mutations::UpdateEvent = GraphQL::Relay::Mutation.define do
  name 'UpdateEvent'
  return_field :event, Types::EventType

  input_field :id, !types.Int
  input_field :event, !Types::EventInputType

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:id])
    event_attrs = args[:event].to_h.merge(
      updated_by: ctx[:user_con_profile].user
    )
    event.assign_form_response_attributes(
      JSON.parse(event_attrs.delete('form_response_attrs_json'))
    )
    event.assign_attributes(event_attrs)

    registration_policy_attributes = event_attributes.delete('registration_policy')

    event.assign_attributes(event_attributes)
    changes = event.changes.as_json

    new_registration_policy = RegistrationPolicy.new(registration_policy_attributes)
    if event.registration_policy != new_registration_policy
      changes['registration_policy'] = [
        event.registration_policy.as_json,
        new_registration_policy.as_json
      ]

      EventChangeRegistrationPolicyService.new(
        event,
        new_registration_policy,
        ctx[:user_con_profile]
      ).call!
    end

    event.reload
    event.assign_attributes(event_attributes)
    event.save!
    EventsMailer.event_updated(event, changes, ctx[:user_con_profile]).deliver_later if changes.any?

    { event: event }
  }
end
