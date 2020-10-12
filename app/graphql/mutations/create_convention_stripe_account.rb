class Mutations::CreateConventionStripeAccount < Mutations::BaseMutation
  field :stripe_account, Types::StripeAccountType, null: false

  # define_authorization_check do |_args|
  #   @convention = context[:convention]
  #   policy(@convention).update?
  # end

  def resolve
    account = Stripe::Account.create({ type: 'standard' })
    convention.update!(stripe_account_id: account.id)

    { stripe_account: account }
  end
end
