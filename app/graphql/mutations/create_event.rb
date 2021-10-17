# frozen_string_literal: true
class Mutations::CreateEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :event, Types::EventInputType, required: true

  authorize_create_convention_associated_model :events

  def resolve(**args)
    event_attrs =
      process_transitional_ids_in_input(args[:event].to_h, :event_category_id)
        .merge(updated_by: user_con_profile.user)
        .stringify_keys
    form_response_attrs = JSON.parse(event_attrs.delete('form_response_attrs_json'))

    event = convention.events.new(event_attrs)
    event.assign_form_response_attributes(
      event.filter_form_response_attributes_for_assignment(
        form_response_attrs,
        event.event_category.event_form.form_items,
        context[:pundit_user]
      )
    )
    event.save!

    { event: event }
  end
end
