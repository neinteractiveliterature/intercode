class Mutations::UpdateSignupCounted < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false

  argument :id, Integer, required: true
  argument :counted, Boolean, required: true

  def resolve(**args)
    signup = convention.signups.find(args[:id])
    signup.update!(counted: args[:counted])

    if signup.counted_previously_changed? && !args[:counted] && signup.bucket_key
      EventVacancyFillService.new(signup.run, signup.bucket_key).call!
    end

    { signup: signup }
  end
end
