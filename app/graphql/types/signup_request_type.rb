# frozen_string_literal: true
class Types::SignupRequestType < Types::BaseObject
  authorize_record

  field :id,
        Int,
        deprecation_reason:
          "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :state, Types::SignupRequestStateType, null: false
  field :requested_bucket_key, String, null: true
  field :user_con_profile, Types::UserConProfileType, null: false
  field :target_run, Types::RunType, null: false
  field :replace_signup, Types::SignupType, null: true
  field :result_signup, Types::SignupType, null: true
  field :created_at, Types::DateType, null: false
  field :updated_at, Types::DateType, null: false
  field :updated_by, Types::UserType, null: false

  association_loaders SignupRequest, :user_con_profile, :target_run, :replace_signup, :result_signup
end
