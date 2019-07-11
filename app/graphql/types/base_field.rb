class Types::BaseField < GraphQL::Schema::Field
  def authorize(&block)
    @authorization_block = block
  end

  def authorized?(value, context)
    return true unless @authorization_block
    @authorization_block.call(value, context)
  end

  def authorize_action(action)
    authorize do |value, context|
      policy = Pundit.policy(context[:pundit_user], value)
      policy.public_send("#{action}?")
    end
  end
end
