# frozen_string_literal: true
class Mutations::UpdateSignupCounted < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false

  argument :id, ID, required: false
  argument :counted, Boolean, required: true

  load_and_authorize_convention_associated_model :signups, :id, :update_counted

  def resolve(**args)
    signup.update!(counted: args[:counted])

    if signup.counted_previously_changed? && !args[:counted] && signup.bucket_key
      EventVacancyFillService.new(signup.run, signup.bucket_key).call!
    end

    { signup: signup }
  end
end
