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

  association_loaders SignupChange, :previous_signup_change, :run, :user_con_profile

  # Ugly AF, but it gets us everything the policy wants
  def signup
    AssociationLoader.for(SignupChange, :signup).load(object).then do |signup|
      run_promise = AssociationLoader.for(Signup, :run).load(signup).then do |run|
        AssociationLoader.for(Run, :event).load(run).then do |event|
          AssociationLoader.for(Event, :convention).load(event)
        end
      end

      Promise.all([
        run_promise, AssociationLoader.for(Signup, :user_con_profile).load(signup)
      ]).then do |_results|
        signup
      end
    end
  end

  # Why not just do this as an authorized hook?  We need it to be safe to ask for this data even if
  # you can't actually read it
  def bucket_key
    return nil unless object.bucket_key

    signup.then do |signup|
      registration_policy = object.run.event.registration_policy
      expose_attendees = registration_policy.bucket_with_key(object.bucket_key)&.expose_attendees?
      return unless expose_attendees || policy(signup).read_requested_bucket_key?
      object.bucket_key
    end
  end

  def counted
    !!object.counted
  end
end
