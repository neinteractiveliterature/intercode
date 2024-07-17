# frozen_string_literal: true
class Types::UserType < Types::BaseObject
  authorize_record

  field :id, ID, null: false
  field :privileges, [String], null: true
  field :name, String, null: true
  field :name_inverted, String, null: true
  field :first_name, String, null: true
  field :last_name, String, null: true
  field :email, String, null: true
  field :event_proposals, [Types::EventProposalType], null: false
  field :user_con_profiles, [Types::UserConProfileType], null: false

  association_loaders User, :user_con_profiles

  def event_proposals
    event_proposals = dataloader.with(Sources::ActiveRecordAssociation, User, :event_proposals).load(object)

    # avoid n+1 in the policy check
    ::ActiveRecord::Associations::Preloader.new(records: event_proposals, associations: :owner).call

    event_proposals
  end
end
