# frozen_string_literal: true
class Mutations::CreateFillerEvent < Mutations::BaseMutation
  description "Create a new filler event (a single-run event with no signup process, e.g. an ongoing activity)"

  field :event, Types::EventType, null: false, description: "The newly-created event"

  argument :event, Types::EventInputType, required: true, description: "The event attributes"
  argument :run, Types::RunInputType, required: false, description: "The initial run to create for this event"
  argument :signed_image_blob_ids,
           [ID],
           required: false,
           description: "Signed blob IDs for images to attach to this event"

  authorize_create_convention_associated_model :events

  # rubocop:disable Metrics/AbcSize
  def resolve(signed_image_blob_ids: nil, **args)
    event_attrs = args[:event].to_h.merge(updated_by: user_con_profile.user).stringify_keys
    form_response_attrs = JSON.parse(event_attrs.delete("form_response_attrs_json"))

    event = convention.events.new(event_attrs)
    # registration_policy is a belongs_to association, not a plain form value -- assigning a raw
    # hash through the generic form-response path below would raise
    # ActiveRecord::AssociationTypeMismatch (there's no accepts_nested_attributes_for). Build a
    # real RegistrationPolicy explicitly instead; build_from_hash(nil) already returns an empty,
    # fail-closed policy when the client doesn't submit one, which registration_policy_id being
    # NOT NULL requires regardless.
    event.registration_policy = RegistrationPolicy.build_from_hash(form_response_attrs.delete("registration_policy"))
    event.assign_form_response_attributes(
      event.filter_form_response_attributes_for_assignment(
        form_response_attrs,
        event.event_category.event_form.form_items,
        context[:pundit_user]
      )
    )
    (signed_image_blob_ids || []).each do |signed_blob_id|
      blob = ActiveStorage::Blob.find_signed!(signed_blob_id)
      event.images.attach(blob)
    end

    event.runs.new(args[:run].to_h.merge(updated_by: user_con_profile.user)) if args[:run]

    event.save!

    { event: }
  end
  # rubocop:enable Metrics/AbcSize
end
