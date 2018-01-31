def process_scheduled_value_input(input_data)
  timespans_data = input_data[:timespans].map do |timespan|
    value = (timespan[:string_value] if timespan[:string_value])

    {
      start: timespan[:start],
      finish: timespan[:finish],
      value: value
    }
  end

  {
    timespans: timespans_data
  }
end

Mutations::UpdateConvention = GraphQL::Relay::Mutation.define do
  name 'UpdateConvention'
  return_field :convention, Types::ConventionType

  input_field :id, types.Int
  input_field :convention, !Types::ConventionInputType

  resolve MutationErrorHandler.new(
    ->(_obj, args, ctx) {
      convention = args[:id] ? Convention.find(args[:id]) : ctx[:convention]

      convention_data = args[:convention].to_h.merge(
        'maximum_event_signups' => process_scheduled_value_input(args[:convention][:maximum_event_signups]),
        'updated_by' => ctx[:user_con_profile].user
      )

      convention.update!(convention_data)

      { convention: convention }
    }
  )
end
