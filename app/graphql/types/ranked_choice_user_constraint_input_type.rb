# frozen_string_literal: true
class Types::RankedChoiceUserConstraintInputType < Types::BaseInputObject
  description <<~MARKDOWN
    A user-defined constraint on how many events the ranked choice algorithm should sign them up for.  This can be
    time-bounded, and a user can have as many or as few of these as they like.
  MARKDOWN

  argument :finish, Types::DateType, required: false do
    description <<~MARKDOWN
      The time at which this constraint stops applying (non-inclusive).  If null, this constraint is unbounded on the
      finish side.
    MARKDOWN
  end
  argument :maximum_signups, Int, required: false do
    description "The maximum number of counted signups to be allowed in the timespan described by this constraint."
  end
  argument :start, Types::DateType, required: false do
    description <<~MARKDOWN
      The time at which this constraint starts applying (inclusive).  If null, this constraint is unbounded on the
      start side.
    MARKDOWN
  end
end
