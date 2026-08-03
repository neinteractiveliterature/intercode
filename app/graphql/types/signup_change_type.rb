# frozen_string_literal: true
class Types::SignupChangeType < Types::BaseObject
  description "A record of a single change made to a signup, kept for audit purposes"

  authorize_record

  field :action, Types::SignupChangeActionType, null: false, description: "What triggered this change"
  field :bucket, Types::RegistrationPolicyBucketType, null: true, description: "The bucket assigned by this change"
  field :bucket_key,
        String,
        null: true,
        camelize: false,
        deprecation_reason: "Use bucket or bucketName instead",
        description: "The key of the bucket assigned by this change"
  field :bucket_name, # rubocop:disable GraphQL/ExtractType
        String,
        null: true,
        camelize: false,
        description: "The name of the bucket assigned by this change, as of when the change happened"
  field :counted, Boolean, null: false, description: "Whether the signup counted towards totals after this change"
  field :created_at, Types::DateType, null: false, camelize: false, description: "When this change happened"
  field :id, ID, null: false, description: "The ID of this change"
  field :previous_signup_change,
        Types::SignupChangeType,
        null: true,
        description: "The change that happened before this one, if any"
  field :run, Types::RunType, null: false, description: "The run this signup change happened on"
  field :signup, Types::SignupType, null: false, description: "The signup this change happened to"
  field :state, Types::SignupStateType, null: false, description: "The state of the signup after this change"
  field :updated_at, Types::DateType, null: false, camelize: false, description: "When this change was last updated"
  field :user_con_profile,
        Types::UserConProfileType,
        null: false,
        camelize: false,
        description: "The profile of the person whose signup changed"

  association_loaders SignupChange, :previous_signup_change, :run, :user_con_profile

  # Ugly AF, but it gets us everything the policy wants
  def signup
    signup = dataloader.with(Sources::ActiveRecordAssociation, SignupChange, :signup).load(object)
    run = dataloader.with(Sources::ActiveRecordAssociation, Signup, :run).load(signup)
    event = dataloader.with(Sources::ActiveRecordAssociation, Run, :event).load(run)
    dataloader.with(Sources::ActiveRecordAssociation, Event, :convention).load(event)
    dataloader.with(Sources::ActiveRecordAssociation, Signup, :user_con_profile).load(signup)

    signup
  end

  def counted # rubocop:disable Naming/PredicateMethod
    !!object.counted
  end

  # Why not just do this as an authorized hook?  We need it to be safe to ask for this data even if
  # you can't actually read it
  def bucket
    return unless exposed_bucket?
    object.bucket
  end

  def bucket_key
    bucket&.key
  end

  def bucket_name
    return unless exposed_bucket?
    object.bucket_name
  end

  private

  # The bucket referenced here may have been destroyed since this change was recorded (bucket_id
  # nullifies on delete, bucket_name is kept as a permanent snapshot), so this checks the live
  # bucket's expose_attendees when it still exists, falling back to the read_requested_bucket_key
  # policy otherwise -- same as before this was backed by a real association.
  def exposed_bucket?
    return @exposed_bucket if defined?(@exposed_bucket)
    @exposed_bucket = !!(object.bucket&.expose_attendees? || policy(signup).read_requested_bucket_key?)
  end
end
