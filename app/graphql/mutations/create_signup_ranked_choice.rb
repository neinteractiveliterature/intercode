# frozen_string_literal: true
class Mutations::CreateSignupRankedChoice < Mutations::BaseMutation
  field :signup_ranked_choice, Types::SignupRankedChoiceType, null: false

  argument :target_run_id, ID, required: false, camelize: true
  argument :requested_bucket_key, String, required: false, camelize: false

  attr_reader :target_run

  define_authorization_check do |args|
    @target_run = convention.runs.find(args[:target_run_id])
    policy(SignupRankedChoicePolicy.new(target_run: target_run, user_con_profile: user_con_profile)).create?
  end

  def resolve(**args)
    signup_ranked_choice =
      user_con_profile.signup_ranked_choices.create!(
        target_run: target_run,
        requested_bucket_key: args[:requested_bucket_key],
        updated_by: current_user
      )

    { signup_ranked_choice: signup_ranked_choice }
  end
end
