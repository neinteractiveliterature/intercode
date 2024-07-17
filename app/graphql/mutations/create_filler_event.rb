# frozen_string_literal: true
class Mutations::CreateFillerEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :event, Types::EventInputType, required: true
  argument :run, Types::RunInputType, required: false
  argument :signed_image_blob_ids, [ID], required: false

  authorize_create_convention_associated_model :events

  # rubocop:disable Metrics/AbcSize
  def resolve(signed_image_blob_ids: nil, **args)
    event_attrs = args[:event].to_h.merge(updated_by: user_con_profile.user).stringify_keys
    form_response_attrs = JSON.parse(event_attrs.delete('form_response_attrs_json'))

    event = convention.events.new(event_attrs)
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
