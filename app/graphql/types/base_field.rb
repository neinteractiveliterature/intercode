class Types::BaseField < GraphQL::Schema::Field
  # We don't camelize fields in the Intercode API (this could change later)
  def initialize(*args, camelize: false, **kwargs, &block)
    super
  end

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
