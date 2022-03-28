# frozen_string_literal: true
class Types::SignupType < Types::BaseObject
  authorize_record

  field :id, ID, null: false
  field :state, Types::SignupStateType, null: false
  field :counted, Boolean, null: false
  field :bucket_key, String, null: true, camelize: false
  field :age_restrictions_check, String, null: false, camelize: false
  field :requested_bucket_key, String, null: true, camelize: false do
    authorize_action :read_requested_bucket_key
  end

  field :run, Types::RunType, null: false
  field :user_con_profile, Types::UserConProfileType, null: false, camelize: false
  field :choice, Int, null: true do
    authorize { |_value, _args, context| Pundit.policy(context[:pundit_user], context[:convention]).view_reports? }
  end
  field :waitlist_position, Int, null: true, camelize: false
  field :expires_at, Types::DateType, null: true

  field :created_at, Types::DateType, null: false, camelize: false
  field :updated_at, Types::DateType, null: false, camelize: false

  # Why not just do this as an authorized hook?  We need it to be safe to ask for this data even if
  # you can't actually read it
  def bucket_key
    return unless object.bucket&.expose_attendees? || policy(object).read_requested_bucket_key?
    object.bucket_key
  end

  def run
    RecordLoader.for(Run).load(object.run_id)
  end

  def user_con_profile
    RecordLoader.for(UserConProfile, includes: [:convention]).load(object.user_con_profile_id)
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
