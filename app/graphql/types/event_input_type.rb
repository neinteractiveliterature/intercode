# frozen_string_literal: true
class Types::EventInputType < Types::BaseInputObject
  description "Input for creating or updating an event"

  argument :add_image_blob_ids,
           [ID],
           required: false,
           camelize: true,
           description: "Signed blob IDs for images to attach to this event"
  argument :bucket_key_mappings,
           [Types::BucketKeyMappingInputType],
           required: false,
           camelize: false,
           description: "Mappings from old bucket keys to new bucket keys when changing the registration policy"
  argument :event_category_id,
           ID,
           required: false,
           camelize: true,
           description: "The ID of the event category for this event"
  argument :form_response_attrs_json,
           String,
           required: false,
           camelize: false,
           description: "JSON-encoded form response attributes for this event"
  argument :remove_image_blob_ids,
           [ID],
           required: false,
           camelize: true,
           description: "Signed blob IDs for images to detach from this event"
end
