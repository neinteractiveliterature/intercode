# frozen_string_literal: true
class Types::TeamMemberType < Types::BaseObject
  graphql_name 'TeamMember'
  authorize_record

  field :id, ID, null: false
  field :display_team_member, Boolean, null: false
  field :show_email, Boolean, null: false, camelize: false
  field :receive_con_email, Boolean, null: false, camelize: false
  field :receive_signup_email, Types::ReceiveSignupEmailType, null: false, camelize: false
  field :email, String, null: true
  field :event, Types::EventType, null: false
  field :user_con_profile, Types::UserConProfileType, null: false, camelize: false

  association_loaders TeamMember, :event, :user_con_profile

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

  def email
    return nil unless current_user
    object.email
  end
end
