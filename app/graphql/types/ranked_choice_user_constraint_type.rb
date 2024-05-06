# frozen_string_literal: true

module Types
  class RankedChoiceUserConstraintType < Types::BaseObject
    description <<~MARKDOWN
      A user-defined constraint on how many events the ranked choice algorithm should sign them up for.  This can be
      time-bounded, and a user can have as many or as few of these as they like.
    MARKDOWN

    field :created_at, Types::DateType, null: false, description: "When this constraint was created."
    field :finish, Types::DateType do
      description <<~MARKDOWN
        The time at which this constraint stops applying (non-inclusive).  If null, this constraint is unbounded on the
        finish side.
      MARKDOWN
    end
    field :id, ID, null: false, description: "The ID of this constraint."
    field :maximum_signups, Integer, null: false do
      description "The maximum number of counted signups to be allowed in the timespan described by this constraint."
    end
    field :start, Types::DateType do
      description <<~MARKDOWN
        The time at which this constraint starts applying (inclusive).  If null, this constraint is unbounded on the
        start side.
      MARKDOWN
    end
    field :updated_at, Types::DateType, null: false do
      description "The last time this constraint was modified."
    end
    field :user_con_profile, Types::UserConProfileType, null: false, description: "The user this constraint applies to."

    association_loaders RankedChoiceUserConstraint, :user_con_profile
  end
end
