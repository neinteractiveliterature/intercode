# frozen_string_literal: true

module Types
  class RankedChoiceDecisionType < Types::BaseObject
    field :created_at, Types::DateType, null: false do
      description "The time this RankedChoiceDecision was created."
    end
    field :decision, Types::RankedChoiceDecisionValueType, null: false
    field :extra, GraphQL::Types::JSON
    field :id, ID, null: false
    field :reason, Types::RankedChoiceDecisionReasonType
    field :signup, Types::SignupType
    field :signup_ranked_choice, Types::SignupRankedChoiceType
    field :signup_request, Types::SignupRequestType
    field :signup_round, Types::SignupRoundType, null: false
    field :updated_at, Types::DateType, null: false do
      description "The time this RankedChoiceDecision was last modified."
    end
    field :user_con_profile, Types::UserConProfileType

    association_loaders RankedChoiceDecision,
                        :user_con_profile,
                        :signup_ranked_choice,
                        :signup_round,
                        :signup,
                        :signup_request
  end
end
