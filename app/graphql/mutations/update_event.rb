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
    form_response_attrs = JSON.parse(event_attrs.delete('form_response_attrs_json'))
    registration_policy_attributes = form_response_attrs.delete('registration_policy')
    changes = {}

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
    event.assign_form_response_attributes(form_response_attrs)
    event.assign_attributes(event_attrs)
    event.save!

    changes.update(event.form_response_attribute_changes)
    changes.each do |(key, (previous_value, new_value))|
      FormResponseChange.create!(
        response: event,
        user_con_profile: ctx[:user_con_profile],
        field_identifier: key,
        previous_value: previous_value,
        new_value: new_value
      )
    end

    { event: event }
  }
end
