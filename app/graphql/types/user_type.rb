class Types::UserType < Types::BaseObject
  authorize_record

  field :id, Integer, null: false
  field :privileges, [String, null: true], null: true
  field :name, String, null: true
  field :name_inverted, String, null: true
  field :first_name, String, null: true
  field :last_name, String, null: true
  field :email, String, null: true
  field :event_proposals, [Types::EventProposalType], null: false
  field :user_con_profiles, [Types::UserConProfileType], null: false

  association_loaders User, :event_proposals, :user_con_profiles
end
