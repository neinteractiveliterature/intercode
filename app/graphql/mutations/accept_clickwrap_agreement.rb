class Mutations::AcceptClickwrapAgreement < Mutations::BaseMutation
  field :my_profile, Types::UserConProfileType, null: false

  def resolve
    user_con_profile.update!(accepted_clickwrap_agreement: true)
    { my_profile: user_con_profile }
  end
end
