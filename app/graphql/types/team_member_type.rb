# frozen_string_literal: true
# rubocop:disable-next GraphQL/GraphqlName
class Types::TeamMemberType < Types::BaseObject
  description "A person who is part of the team running an event"
  graphql_name "TeamMember"
  authorize_record

  field :display_team_member,
        Boolean,
        null: false,
        description: "Whether to list this person publicly as part of the team"
  field :email, String, null: true, description: "This person's email address, if you are signed in"
  field :event,
        Types::EventType,
        association_model: TeamMember,
        null: false,
        description: "The event this person is on the team of"
  field :id, ID, null: false, description: "The ID of this team member"
  field :receive_con_email,
        Boolean,
        null: false,
        camelize: false,
        description: "Whether this person gets email from the convention about the event"
  # rubocop:disable-next GraphQL/ExtractType
  field :receive_signup_email,
        Types::ReceiveSignupEmailType,
        null: false,
        camelize: false,
        description: "Which signup notifications this person gets by email"
  field :show_email,
        Boolean,
        null: false,
        camelize: false,
        description: "Whether to show this person's email address on the event page"
  field :user_con_profile,
        Types::UserConProfileType,
        association_model: TeamMember,
        null: false,
        camelize: false,
        description: "The profile of this team member"

  def receive_signup_email
    object.receive_signup_email.upcase
  end

  # rubocop:disable-next Naming/PredicateMethod
  def display_team_member
    !!object.display
  end

  # rubocop:disable-next Naming/PredicateMethod
  def show_email
    !!object.show_email
  end

  # rubocop:disable-next Naming/PredicateMethod
  def receive_con_email
    !!object.receive_con_email
  end

  def email
    return nil unless current_user
    object.email
  end
end
