class Mutations::UpdateConvention < Mutations::BaseMutation
  field :convention, Types::ConventionType, null: false

  argument :id, Integer, required: false
  argument :convention, Types::ConventionInputType, required: true

  define_authorization_check do |args|
    @convention = args[:id] ? Convention.find(args[:id]) : context[:convention]
    policy(@convention).update?
  end

  def resolve(**args)
    convention_data = args[:convention].to_h.merge(
      'maximum_event_signups' => process_scheduled_value_input(
        args[:convention].maximum_event_signups
      ),
      'updated_by' => user_con_profile.user
    )

    @convention.update!(convention_data)

    { convention: @convention }
  end

  private

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
end
