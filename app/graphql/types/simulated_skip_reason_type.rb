class Types::SimulatedSkipReasonType < Types::BaseObject
  description "If a SignupRankedChoice would be skipped if executed now, the reason why it would be skipped."

  field :extra, GraphQL::Types::JSON, null: false do
    description "Any additional data the attached to this skip."
  end
  field :reason, Types::RankedChoiceDecisionReasonType, null: false do
    description "The reason this choice would be skipped, if any."
  end

  def reason
    object.reason.to_s
  end
end
