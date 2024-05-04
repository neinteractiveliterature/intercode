# frozen_string_literal: true

module Types
  class SignupRankedChoiceType < Types::BaseObject
    description <<~MARKDOWN
      In a ranked-choice signup convention, SignupRankedChoices are the items in a user's signup queue.  Users may have
      as many of these as they like.  When SignupRounds open, Intercode will automatically attempt to sign users up for
      the number of events they're allowed at this time based on their SignupRankedChoices.
    MARKDOWN

    authorize_record

    field :created_at, Types::DateType, null: false, description: "The time this choice was added to the user's queue"
    field :id, ID, null: false, description: "The ID of this SignupRankedChoice"
    field :priority, Integer, null: false do
      description "The priority of this choice (lower numbers are higher priority)"
    end
    field :requested_bucket_key, String, null: true do
      description "The bucket that this choice is trying to sign up in (or null, if it's a no-preference signup)"
    end
    field :result_signup, Types::SignupType, null: true do
      description "The resulting Signup from processing this choice, if it has been processed"
    end
    field :result_signup_request, Types::SignupRequestType, null: true do # rubocop:disable GraphQL/ExtractType
      description <<~MARKDOWN
        The resulting SignupRequest from processing this choice, if it has been processed (and is in a moderated-signup
        convention)
      MARKDOWN
    end
    field :state, Types::SignupRankedChoiceStateType, null: false do
      description "The current processing state of this choice (e.g. pending, accepted)"
    end
    field :target_run, Types::RunType, null: false do
      description "The event run that this choice is trying to sign up for"
    end
    field :updated_at, Types::DateType, null: false, description: "The last time this choice was modified"
    field :updated_by, Types::UserType, null: false, description: "The user who last updated this choice" # rubocop:disable GraphQL/ExtractType
    field :user_con_profile, Types::UserConProfileType, null: false do
      description "The user whose queue this choice is part of"
    end

    association_loaders SignupRankedChoice, :user_con_profile, :target_run, :result_signup, :result_signup_request
  end
end
