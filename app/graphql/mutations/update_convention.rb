# frozen_string_literal: true
class Mutations::UpdateConvention < Mutations::BaseMutation
  include ScheduledValueInputs

  field :convention, Types::ConventionType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :convention, Types::ConventionInputType, required: true

  define_authorization_check do |args|
    @convention = args[:id] ? Convention.find(args[:transitional_id] || args[:id]) : context[:convention]
    policy(@convention).update?
  end

  def resolve(**args)
    convention_data =
      process_transitional_ids_in_input(
        args[:convention].to_h,
        :root_page_id,
        :default_layout_id,
        :catch_all_staff_position_id
      ).merge(
        'maximum_event_signups' => process_scheduled_value_input(args[:convention].maximum_event_signups),
        'updated_by' => current_user
      )

    @convention.update!(convention_data)

    { convention: @convention }
  end
end
