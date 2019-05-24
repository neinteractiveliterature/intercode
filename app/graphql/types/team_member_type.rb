class Types::TeamMemberType < Types::BaseObject
  graphql_name 'TeamMember'

  field :id, Int, null: false
  field :display, Boolean, null: false, deprecation_reason: 'Use display_team_member instead'
  field :display_team_member, Boolean, null: false
  field :show_email, Boolean, null: false, camelize: false
  field :receive_con_email, Boolean, null: false, camelize: false
  field :receive_signup_email, Types::ReceiveSignupEmailType, null: false, camelize: false
  field :email, String, null: true
  field :event, Types::EventType, null: false
  field :user_con_profile, Types::UserConProfileType, null: false, camelize: false

  def event
    RecordLoader.for(Event).load(object.event_id)
  end

  def user_con_profile
    RecordLoader.for(UserConProfile).load(object.user_con_profile_id)
  end

  def receive_signup_email
    object.receive_signup_email.upcase
  end

  def display_team_member
    !!object.display
  end

  def show_email
    !!object.show_email
  end

  def receive_con_email
    !!object.receive_con_email
  end
end
