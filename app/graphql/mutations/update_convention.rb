# frozen_string_literal: true
class Mutations::UpdateConvention < Mutations::BaseMutation
  include ScheduledValueInputs

  field :convention, Types::ConventionType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true
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
