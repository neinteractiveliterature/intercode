# frozen_string_literal: true
class Types::UserType < Types::BaseObject
  authorize_record

  field :id,
        Integer,
        deprecation_reason:
          "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
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
    AssociationLoader
      .new(User, :event_proposals)
      .load(object)
      .then do |event_proposals|
        # avoid n+1 in the policy check
        ::ActiveRecord::Associations::Preloader.new.preload(event_proposals, :owner)
        event_proposals
      end
  end
end
