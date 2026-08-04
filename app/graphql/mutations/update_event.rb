# frozen_string_literal: true
class Mutations::UpdateEvent < Mutations::BaseMutation
  description "Update an event"

  field :event, Types::EventType, null: false, description: "The updated event"

  argument :event, Types::EventInputType, required: false, description: "The event attributes to update"
  argument :id, ID, required: false, description: "The ID of the event to update"

  load_and_authorize_convention_associated_model :events, :id, :update

  def resolve(**args)
    event_attrs = args[:event].to_h.merge(updated_by: user_con_profile.user).stringify_keys
    bucket_key_changes = event_attrs.delete("bucket_key_mappings")
    form_response_attrs = JSON.parse(event_attrs.delete("form_response_attrs_json"))
    registration_policy_attributes = form_response_attrs.delete("registration_policy")

    changes = apply_registration_policy(event, registration_policy_attributes, bucket_key_changes)
    changes.update(apply_form_response_attrs(event, form_response_attrs))
    event.assign_attributes(event_attrs)
    event.save!

    log_form_response_changes(event, changes)

    { event: }
  end

  private

  def apply_registration_policy(event, registration_policy_attributes, bucket_key_mappings)
    change = event.registration_policy_change_for(registration_policy_attributes)
    return {} unless change

    resolved_mappings = resolve_bucket_key_mappings(event, bucket_key_mappings)
    EventChangeRegistrationPolicyService.new(event, change.new_policy, current_user, resolved_mappings).call!
    event.reload

    { "registration_policy" => [change.old_json, event.registration_policy.as_json] }
  end

  # EventChangeRegistrationPolicyService still works entirely in terms of from_key/to_key (see the
  # comment on that service). This resolves incoming from_bucket_id/to_bucket_id args (only usable
  # when the destination bucket already exists, since a bucket being newly created in this same
  # edit has no id yet) down to that shape.
  def resolve_bucket_key_mappings(event, bucket_key_mappings)
    (bucket_key_mappings || []).map { |mapping| resolve_bucket_key_mapping(event, mapping.to_h) }
  end

  def resolve_bucket_key_mapping(event, mapping)
    {
      from_key: mapping[:from_key] || bucket_key_for_id(event, mapping[:from_bucket_id]),
      to_key: mapping[:to_key] || bucket_key_for_id(event, mapping[:to_bucket_id])
    }
  end

  def bucket_key_for_id(event, bucket_id)
    return nil unless bucket_id
    event.registration_policy.bucket_with_id(bucket_id.to_i)&.key
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
      FormResponseChange.create!(response: event, user_con_profile:, field_identifier: key, previous_value:, new_value:)
    end
  end
end
