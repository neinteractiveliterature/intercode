# frozen_string_literal: true
class Types::UserType < Types::BaseObject
  authorize_record

  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
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
