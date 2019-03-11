class Types::UserType < Types::BaseObject
  field :id, Integer, null: false
  field :privileges, [String, null: true], null: true
  field :name, String, null: true
  field :name_inverted, String, null: true
  field :first_name, String, null: true
  field :last_name, String, null: true
  field :email, String, null: true

  field :event_proposals, [Types::EventProposalType], null: false do
    guard ->(graphql_object, _args, ctx) do
      ctx[:current_ability].can?(
        :read,
        EventProposal.new(owner: UserConProfile.new(user: graphql_object.object))
      )
    end
  end

  association_loaders User, :event_proposals
end
