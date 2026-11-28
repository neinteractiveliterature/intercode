# frozen_string_literal: true
class Types::BaseField < GraphQL::Schema::Field
  # association_model: makes the field an ActiveRecord association of that model, loaded in batches by both execution
  # engines.  dataload: is what execute_next uses, and the method from association_loader is what the original engine
  # uses.  The field has to have the same name as the association.
  def initialize(*, association_model: nil, **kwargs, &)
    association = kwargs[:name]&.to_sym
    if association_model
      kwargs[:dataload] = { with: Sources::ActiveRecordAssociation, by: [association_model, association] }
    end
    super(*, **kwargs, &)
    kwargs.fetch(:owner).association_loader(association_model, association) if association_model
  end

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
      policy.public_send(:"#{action}?")
    end
  end
end
