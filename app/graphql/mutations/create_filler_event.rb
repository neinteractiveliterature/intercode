Mutations::CreateFillerEvent = GraphQL::Relay::Mutation.define do
  name 'CreateFillerEvent'
  return_field :event, Types::EventType

  input_field :event, !Types::EventInputType
  input_field :run, !Types::RunInputType

  resolve ->(_obj, args, ctx) {
    event_attrs = args[:event].to_h.merge(
      category: 'filler',
      updated_by: ctx[:user_con_profile].user
    )
    form_response_attrs = JSON.parse(event_attrs.delete('form_response_attrs_json'))

    event = ctx[:convention].events.new(event_attrs)
    event.assign_form_response_attributes(form_response_attrs)

    event.runs.new(
      args[:run].to_h.merge(
        updated_by: ctx[:user_con_profile].user
      )
    )

    event.save!

    { event: event }
  }
end
