# frozen_string_literal: true
class Mutations::UpdateSignupCounted < Mutations::BaseMutation
  description "Change whether a signup counts towards the event's total signups and its bucket's slots"

  field :signup, Types::SignupType, null: false, description: "The updated signup"

  argument :counted, Boolean, required: true, description: "Whether the signup should count towards totals"
  argument :id, ID, required: false, description: "The ID of the signup to update"

  load_and_authorize_convention_associated_model :signups, :id, :update_counted

  def resolve(**args)
    signup.update!(counted: args[:counted])

    if signup.counted_previously_changed? && !args[:counted] && signup.bucket_id
      EventVacancyFillService.new(signup.run, signup.bucket_id).call!
    end

    { signup: }
  end
end
