# frozen_string_literal: true

module Types
  class SignupRoundType < Types::BaseObject
    description <<~MARKDOWN
      A round of signups in a particular convention.  This represents a range of time in which a certain number of
      signups is allowed.

      In conventions that use automated signups (e.g. ranked-choice signups), signup rounds are used as triggers for
      signup automation.
    MARKDOWN

    field :convention, Types::ConventionType, null: false, description: "The convention this SignupRound is in."
    field :created_at, Types::DateType, null: false, description: "When this SignupRound was first created."
    field :executed_at, Types::DateType do
      description <<~MARKDOWN
        In conventions that use automated signups, when this SignupRound was executed.  If it has not been executed yet,
        this will be null.
      MARKDOWN
    end
    field :id, ID, null: false, description: "The ID of this SignupRound."
    field :maximum_event_signups, String, null: false do
      description <<~MARKDOWN
        Either "not_yet", "not_now", "unlimited", or a string representation of a number.  This is the maximum number of
        signups allowed during this SignupRound.
      MARKDOWN
    end
    field :ranked_choice_order, Types::RankedChoiceOrder do
      description <<~MARKDOWN
        In ranked-choice signup conventions, the order to use for executing users' ranked choices in this round.
      MARKDOWN
    end
    field :start, Types::DateType, description: "When this SignupRound starts."
    field :updated_at, Types::DateType, null: false, description: "When this SignupRound was last modified."

    association_loaders SignupRound, :convention
  end
end
