class Types::SignupChangeType < Types::BaseObject
  authorize_record

  field :id, Int, null: false
  field :state, Types::SignupStateType, null: false
  field :counted, Boolean, null: false
  field :previous_signup_change, Types::SignupChangeType, null: true
  field :bucket_key, String, null: true, camelize: false
  field :run, Types::RunType, null: false
  field :signup, Types::SignupType, null: false
  field :action, Types::SignupChangeActionType, null: false
  field :user_con_profile, Types::UserConProfileType, null: false, camelize: false
  field :created_at, Types::DateType, null: false, camelize: false
  field :updated_at, Types::DateType, null: false, camelize: false

  association_loaders SignupChange, :previous_signup_change, :signup, :run, :user_con_profile

  # Why not just do this as an authorized hook?  We need it to be safe to ask for this data even if
  # you can't actually read it
  def bucket_key
    return nil unless object.bucket_key
    registration_policy = object.run.event.registration_policy
    expose_attendees = registration_policy.bucket_with_key(object.bucket_key)&.expose_attendees?
    return unless expose_attendees || policy(object.signup).read_requested_bucket_key?
    object.bucket_key
  end

  def counted
    !!object.counted
  end
end
