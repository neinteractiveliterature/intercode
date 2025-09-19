# frozen_string_literal: true
class Types::UserType < Types::BaseObject
  description <<~MARKDOWN
    A user on this instance of Intercode.  Users exist across all conventions.  For each convention a user has logged
    into, they will have an attached UserConProfile.
  MARKDOWN

  authorize_record

  field :email, String, null: true, description: "The user's email address"
  field :event_proposals, [Types::EventProposalType], null: false, description: "The event proposals owned by this user"
  field :first_name, String, null: true, description: "The user's first name"
  field :id, ID, null: false, description: "The unique ID of this user"
  field :last_name, String, null: true, description: "The user's last name"
  field :name, String, null: true, description: "The user's full name"
  field :name_inverted, String, null: true, description: "The user's full name in Last, First format"
  field :privileges, [String], null: true, description: "The global privileges this user has across all conventions"
  field :user_con_profiles, [Types::UserConProfileType], null: false do
    description "All of the UserConProfiles owned by this user"
  end

  association_loaders User, :user_con_profiles

  def event_proposals
    event_proposals = dataloader.with(Sources::ActiveRecordAssociation, User, :event_proposals).load(object)

    # avoid n+1 in the policy check
    ::ActiveRecord::Associations::Preloader.new(records: event_proposals, associations: :owner).call

    event_proposals.select { |p| policy(p).read? }
  end
end
