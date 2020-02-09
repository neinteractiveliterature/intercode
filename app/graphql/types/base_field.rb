class Types::BaseField < GraphQL::Schema::Field
  def authorize(&block)
    @authorization_block = block
  end

  def authorized?(obj, args, context)
    return true unless @authorization_block
    @authorization_block.call(obj, args, context)
  end

  def authorize_action(action)
    authorize do |obj, _args, context|
      policy = Pundit.policy(context[:pundit_user], obj)
      policy.public_send("#{action}?")
    end
  end
end
