# frozen_string_literal: true
class Mutations::UpdateSignupCounted < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
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
