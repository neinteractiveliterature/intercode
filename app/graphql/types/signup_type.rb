class Types::SignupType < Types::BaseObject

  field :state, Types::SignupStateType, null: true
  field :counted, Boolean, null: true
  field :bucket_key, String, null: true
  field :requested_bucket_key, String, null: true

  field :run, Types::RunType, null: true

  def run
    RecordLoader.for(Run).load(@object.run_id)
  end

  field :user_con_profile, Types::UserConProfileType, null: true

  def user_con_profile
    RecordLoader.for(UserConProfile).load(@object.user_con_profile_id)
  end
end
