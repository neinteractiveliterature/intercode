# frozen_string_literal: true
class Types::SignupType < Types::BaseObject
  description "A signup for a run of an event"

  authorize_record

  field :age_restrictions_check,
        String,
        null: false,
        camelize: false,
        description: "Whether the signed-up attendee meets the event's age restrictions, if any"
  field :bucket, Types::RegistrationPolicyBucketType, null: true, description: "The bucket assigned to this signup"
  field :bucket_key,
        String,
        null: true,
        camelize: false,
        deprecation_reason: "Use bucket instead",
        description: "The key of the bucket assigned to this signup"
  field :counted,
        Boolean,
        null: false,
        description: "Whether this signup counts towards the event's and attendee's signup totals"
  field :id, ID, null: false, description: "The ID of this signup"
  field :requested_bucket, Types::RegistrationPolicyBucketType, null: true do
    description "The bucket this signup requested, if any"
    authorize_action :read_requested_bucket_key
  end
  field :requested_bucket_key, # rubocop:disable GraphQL/ExtractType
        String,
        null: true,
        camelize: false,
        deprecation_reason: "Use requestedBucket instead" do
    description "The key of the bucket this signup requested, if any"
    authorize_action :read_requested_bucket_key
  end
  field :state, Types::SignupStateType, null: false, description: "The state of this signup"

  field :choice, Int, null: true do
    description "The order in which this signup was made, among the attendee's other counted signups"
    authorize { |_value, _args, context| Pundit.policy(context[:pundit_user], context[:convention]).view_reports? }
  end
  field :expires_at,
        Types::DateType,
        null: true,
        description: "When this signup will expire, if it's being held temporarily"
  field :run, Types::RunType, null: false, description: "The run this signup is for"
  field :user_con_profile,
        Types::UserConProfileType,
        null: false,
        camelize: false,
        description: "The profile of the person who is signed up"
  field :waitlist_position,
        Int,
        null: true,
        camelize: false,
        description: "This signup's position on the waitlist, if it's waitlisted"

  field :created_at, Types::DateType, null: false, camelize: false, description: "When this signup was created"
  field :updated_at, Types::DateType, null: false, camelize: false, description: "When this signup was last updated"

  association_loaders Signup, :run, :user_con_profile, :requested_bucket

  # Why not just do this as an authorized hook?  We need it to be safe to ask for this data even if
  # you can't actually read it
  def bucket
    loaded_bucket = dataloader.with(Sources::ActiveRecordAssociation, Signup, :bucket).load(object)
    return unless loaded_bucket&.expose_attendees? || policy(object).read_requested_bucket_key?
    loaded_bucket
  end

  def bucket_key
    bucket&.key
  end

  def requested_bucket_key
    requested_bucket&.key
  end

  def run
    dataloader.with(Sources::ModelById, Run).load(object.run_id)
  end

  def user_con_profile
    dataloader.with(Sources::ModelById, UserConProfile, includes: [:convention]).load(object.user_con_profile_id)
  end

  def choice
    dataloader.with(Sources::SignupChoice).load(object)
  end

  def waitlist_position
    return nil unless object.waitlisted?
    dataloader.with(Sources::WaitlistPosition).load(object)
  end

  def age_restrictions_check
    run.event # just to preload the association
    object.age_restrictions_check
  end

  def counted # rubocop:disable Naming/PredicateMethod
    !!object.counted
  end
end
