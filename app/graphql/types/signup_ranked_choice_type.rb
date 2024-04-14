# frozen_string_literal: true

module Types
  class SignupRankedChoiceType < Types::BaseObject
    authorize_record

    field :id, ID, null: false
    field :priority, Integer, null: true
    field :state, Types::SignupRankedChoiceStateType, null: false
    field :requested_bucket_key, String, null: true
    field :user_con_profile, Types::UserConProfileType, null: false
    field :target_run, Types::RunType, null: false
    field :result_signup, Types::SignupType, null: true
    field :result_signup_request, Types::SignupRequestType, null: true
    field :created_at, Types::DateType, null: false
    field :updated_at, Types::DateType, null: false
    field :updated_by, Types::UserType, null: false

    association_loaders SignupRankedChoice, :user_con_profile, :target_run, :result_signup, :result_signup_request
  end
end
