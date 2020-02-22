class Mutations::UpdateEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :id, Integer, required: false
  argument :event, Types::EventInputType, required: false

  load_and_authorize_convention_associated_model :events, :id, :update

  def resolve(**args)
    event_attrs = args[:event].to_h.merge(
      updated_by: user_con_profile.user
    ).stringify_keys
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

    EventChangeRegistrationPolicyService.new(
      event,
      new_registration_policy,
      user_con_profile
    ).call!

    event.reload

    {
      'registration_policy' => [event.registration_policy.as_json, new_registration_policy.as_json]
    }
  end

  def apply_form_response_attrs(event, form_response_attrs)
    event.assign_form_response_attributes(form_response_attrs)
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
