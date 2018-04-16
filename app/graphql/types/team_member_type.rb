class Types::TeamMemberType < Types::BaseObject

  field :id, Integer, null: false
  field :display, Boolean, null: false
  field :show_email, Boolean, null: false
  field :receive_con_email, Boolean, null: false
  field :receive_signup_email, Boolean, null: false

  field :event, Types::EventType, null: false

  def event
    RecordLoader.for(Event).load(@object.event_id)
  end

  field :user_con_profile, Types::UserConProfileType, null: false

  def user_con_profile
    RecordLoader.for(UserConProfile).load(@object.user_con_profile_id)
  end
end
