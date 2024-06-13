# frozen_string_literal: true
class Types::SignupRequestType < Types::BaseObject
  description <<~MARKDOWN
    In a moderated-signup convention, SignupRequests are the queue of signups that users have asked to do.  Convention
    staff can go through these requests and accept them (which produces a Signup) or reject them.
  MARKDOWN

  authorize_record

  field :created_at, Types::DateType, null: false, description: "The time this request was put in"
  field :id, ID, null: false, description: "The ID of this SignupRequest"
  field :replace_signup, Types::SignupType, null: true do
    description <<~MARKDOWN
      The signup that this request is asking to replace (e.g. if the user is trying to leave a conflicting event).  If
      this request is accepted, the replace_signup will be withdrawn.
    MARKDOWN
  end
  field :requested_bucket_key, String, null: true do
    description "The bucket that this request is asking to sign up in (or null, if it's a no-preference signup)"
  end
  field :result_signup, Types::SignupType, null: true do
    description "The resulting Signup from accepting this request, if it has been accepted"
  end
  field :state, Types::SignupRequestStateType, null: false do
    description "The current processing state of this request (e.g. pending, accepted, rejected)"
  end
  field :target_run, Types::RunType, null: false, description: "The run the user would like to sign up for"
  field :updated_at, Types::DateType, null: false, description: "The last time this request was modified"
  field :updated_by, Types::UserType, null: false, description: "The last user who modified this request" # rubocop:disable GraphQL/ExtractType
  field :user_con_profile, Types::UserConProfileType, null: false, description: "The user who made this request"

  association_loaders SignupRequest, :user_con_profile, :target_run, :replace_signup, :result_signup
end
