# frozen_string_literal: true
class Mutations::CreateConventionStripeAccount < Mutations::BaseMutation
  field :stripe_account, Types::StripeAccountType, null: false

  define_authorization_check do |_args|
    @convention = context[:convention]
    policy(@convention).update?
  end

  def resolve
    if convention.stripe_account_id
      raise GraphQL::ExecutionError,
            "#{convention.name} already has a Stripe account associated with it.  If you want to change\
 the associated Stripe account, please contact the site administrators."
    end

    account = Stripe::Account.create({ type: "standard" })
    convention.update!(stripe_account_id: account.id)

    { stripe_account: account }
  end
end
