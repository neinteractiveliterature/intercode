# frozen_string_literal: true
class Mutations::UpdateEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :event, Types::EventInputType, required: false

  load_and_authorize_convention_associated_model :events, :id, :update

  def resolve(**args)
    event_attrs =
      process_transitional_ids_in_input(args[:event].to_h, :event_category_id)
        .merge(updated_by: user_con_profile.user)
        .stringify_keys
    form_response_attrs = JSON.parse(event_attrs.delete('form_response_attrs_json'))
    registration_policy_attributes = form_response_attrs.delete('registration_policy')

    changes = apply_registration_policy(event, registration_policy_attributes)
    changes.update(apply_form_response_attrs(event, form_response_attrs))
    event.assign_attributes(event_attrs)
    event.save!

    log_form_response_changes(event, changes)

    { event: event }
  end

  private

  def apply_registration_policy(event, registration_policy_attributes)
    new_registration_policy = RegistrationPolicy.new(registration_policy_attributes)
    return {} if event.registration_policy == new_registration_policy

    EventChangeRegistrationPolicyService.new(event, new_registration_policy, user_con_profile).call!

    event.reload

    { 'registration_policy' => [event.registration_policy.as_json, new_registration_policy.as_json] }
  end

  def apply_form_response_attrs(event, form_response_attrs)
    event.assign_form_response_attributes(
      event.filter_form_response_attributes_for_assignment(
        form_response_attrs,
        event.event_category.event_form.form_items,
        context[:pundit_user]
      )
    )
    event.form_response_attribute_changes
  end

  def log_form_response_changes(event, changes)
    changes.each do |(key, (previous_value, new_value))|
      FormResponseChange.create!(
        response: event,
        user_con_profile: user_con_profile,
        field_identifier: key,
        previous_value: previous_value,
        new_value: new_value
      )
    end
  end
end
