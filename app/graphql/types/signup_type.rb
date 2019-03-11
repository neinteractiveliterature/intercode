class Types::SignupType < Types::BaseObject
  field :id, Int, null: false
  field :state, Types::SignupStateType, null: false
  field :counted, Boolean, null: false
  field :bucket_key, String, null: true, camelize: false
  field :requested_bucket_key, String, null: true, camelize: false do
    guard ->(graphql_object, _args, ctx) do
      ctx[:current_ability].can?(:read, graphql_object.object)
    end
  end

  field :run, Types::RunType, null: false
  field :user_con_profile, Types::UserConProfileType, null: false, camelize: false
  field :choice, Int, null: true do
    guard ->(_signup, _args, ctx) do
      ctx[:current_ability].can?(:view_reports, ctx[:convention])
    end
  end
  field :waitlist_position, Int, null: true, camelize: false

  field :created_at, Types::DateType, null: false, camelize: false
  field :updated_at, Types::DateType, null: false, camelize: false

  # Why not just do this as a guard?  We need it to be safe to ask for this data even if you can't
  # actually read it
  def bucket_key
    return unless can?(:read, object) || object.bucket&.expose_attendees?
    object.bucket_key
  end

  def run
    RecordLoader.for(Run).load(object.run_id)
  end

  def user_con_profile
    RecordLoader.for(UserConProfile).load(object.user_con_profile_id)
  end

  def choice
    SignupChoiceLoader.for.load(object)
  end

  def waitlist_position
    return nil unless object.waitlisted?
    WaitlistPositionLoader.for.load(object)
  end

  def counted
    !!object.counted
  end
end
