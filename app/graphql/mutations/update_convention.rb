class Mutations::UpdateConvention < Mutations::BaseMutation
  include ScheduledValueInputs

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
      'updated_by' => current_user
    )

    @convention.update!(convention_data)

    { convention: @convention }
  end
end
