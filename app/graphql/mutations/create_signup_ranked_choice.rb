# frozen_string_literal: true
class Mutations::CreateSignupRankedChoice < Mutations::BaseMutation
  description "Create a new SignupRankedChoice in a user's signup queue"

  field :signup_ranked_choice, Types::SignupRankedChoiceType, null: false do
    description "The SignupRankedChoice that has been created"
  end

  argument :requested_bucket_key, String, required: false, camelize: false do
    description "The bucket key to queue a signup ranked choice in, or null to queue a no-preference choice"
  end
  argument :target_run_id, ID, required: false, camelize: true do
    description "The ID of the run to queue a signup ranked choice for"
  end

  attr_reader :target_run

  define_authorization_check do |args|
    @target_run = convention.runs.find(args[:target_run_id])
    policy(SignupRankedChoice.new(target_run:, user_con_profile:)).create?
  end

  def resolve(**args)
    signup_ranked_choice =
      user_con_profile.signup_ranked_choices.create!(
        state: "pending",
        target_run:,
        requested_bucket_key: args[:requested_bucket_key],
        updated_by: current_user,
        priority: (user_con_profile.signup_ranked_choices.maximum(:priority) || 0) + 1
      )

    { signup_ranked_choice: }
  end
end
