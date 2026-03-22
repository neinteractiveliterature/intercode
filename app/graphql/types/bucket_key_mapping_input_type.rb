# frozen_string_literal: true
class Types::BucketKeyMappingInputType < Types::BaseInputObject
  description "A mapping from an old bucket key to a new bucket key when changing a registration policy"

  argument :from_key,
           String,
           required: true,
           camelize: false,
           description: "The old bucket key being removed or changed"
  argument :to_key,
           String,
           required: false,
           camelize: false,
           description: "The new bucket key to map to (nil means no preference)"
end
