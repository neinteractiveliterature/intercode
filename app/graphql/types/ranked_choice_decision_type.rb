# frozen_string_literal: true

module Types
  class RankedChoiceDecisionType < Types::BaseObject
    description "A record of a decision the ranked choice automation made while processing a signup round."

    field :created_at, Types::DateType, null: false do
      description "The time this RankedChoiceDecision was created."
    end
    field :decision, Types::RankedChoiceDecisionValueType, null: false do
      description "The decision the algorithm made."
    end
    field :extra, GraphQL::Types::JSON do
      description "Any additional data the algorithm attached to this decision record."
    end
    field :id, ID, null: false do
      description "The ID of this decision record."
    end
    field :reason, Types::RankedChoiceDecisionReasonType do
      description "The reason for this decision, if any."
    end
    field :signup, Types::SignupType, description: "The signup that resulted from this decision, if any."
    field :signup_ranked_choice, Types::SignupRankedChoiceType do
      description "The choice that was being processed when this decision was made, if any."
    end
    field :signup_request, Types::SignupRequestType do
      description "The signup request that resulted from this decision, if any."
    end
    field :signup_round, Types::SignupRoundType, null: false do # rubocop:disable GraphQL/ExtractType
      description "The signup round in which this decision was made."
    end
    field :updated_at, Types::DateType, null: false do
      description "The time this RankedChoiceDecision was last modified."
    end
    field :user_con_profile, Types::UserConProfileType do
      description "The user profile this decision pertains to, if any."
    end

    association_loaders RankedChoiceDecision,
                        :user_con_profile,
                        :signup_ranked_choice,
                        :signup_round,
                        :signup,
                        :signup_request
  end
end
