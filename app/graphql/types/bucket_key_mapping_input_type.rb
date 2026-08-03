# frozen_string_literal: true
class Types::BucketKeyMappingInputType < Types::BaseInputObject
  description "A mapping from an old bucket to a new bucket when changing a registration policy"

  argument :from_bucket_id,
           ID,
           required: false,
           camelize: true,
           description: "The id of the old bucket being removed or changed"
  argument :from_key,
           String,
           required: false,
           camelize: false,
           deprecation_reason: "Use from_bucket_id instead",
           description: "The old bucket key being removed or changed"
  argument :to_bucket_id, ID, required: false, camelize: true, description: <<~MARKDOWN
             The id of the new bucket to map to (nil means no preference). Only usable when mapping
             to a bucket that already exists -- mapping to a bucket being newly created in the same
             edit still requires to_key, since it has no id yet.
           MARKDOWN
  argument :to_key,
           String,
           required: false,
           camelize: false,
           deprecation_reason: "Use to_bucket_id instead",
           description: "The new bucket key to map to (nil means no preference)"
end
