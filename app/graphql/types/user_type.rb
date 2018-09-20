Types::UserType = GraphQL::ObjectType.define do
  name 'User'

  field :id, !types.Int
  field :privileges, types[types.String]
  field :name, types.String
  field :name_inverted, types.String
  field :first_name, types.String
  field :last_name, types.String
  field :email, types.String

  field :event_proposals, !types[Types::EventProposalType] do
    guard ->(user, _args, ctx) do
      ctx[:current_ability].can?(
        :read,
        EventProposal.new(owner: UserConProfile.new(user: user))
      )
    end
    resolve ->(obj, _args, _ctx) do
      AssociationLoader.for(User, :event_proposals).load(obj)
    end
  end
end
