Mutations::CreateEvent = GraphQL::Relay::Mutation.define do
  name 'CreateEvent'
  return_field :event, Types::EventType

  input_field :category, !types.String
  input_field :event, !Types::EventInputType

  resolve ->(_obj, args, ctx) {
    event_attrs = args[:event].to_h.merge(
      updated_by: ctx[:user_con_profile].user,
      category: args[:category]
    )
    form_response_attrs = JSON.parse(event_attrs.delete('form_response_attrs_json'))

    event = ctx[:convention].events.new(event_attrs)
    event.assign_form_response_attributes(form_response_attrs)
    event.save!

    { event: event }
  }
end
