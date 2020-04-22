class Mutations::BaseMutation < GraphQL::Schema::RelayClassicMutation
  include ContextAccessors

  field_class Types::UncamelizedField
  input_object_class Types::BaseInputObject

  def self.require_user_con_profile
    define_method :authorized? do |_args|
      !!user_con_profile
    end
  end

  def self.require_user
    define_method :authorized? do |_args|
      !!current_user
    end
  end

  def self.return_true_or_not_authorized_error(
    authorized, current_user, message: 'Unauthorized mutation'
  )
    return true if authorized
    raise IntercodeSchema::NotAuthorizedError.new(message, current_user: current_user)
  end

  def self.define_authorization_check(message: 'Unauthorized mutation', &block)
    define_method :authorized? do |args|
      auth_result = instance_exec(args, &block)
      self.class.return_true_or_not_authorized_error(auth_result, current_user, message: message)
    end
  end

  def self.check_authorization(policy, action, message: 'Unauthorized mutation')
    return_true_or_not_authorized_error(
      policy.public_send("#{action}?"),
      policy.user,
      message: message
    )
  end

  def self.load_and_authorize_model_with_id(
    model_class, id_field, action, message: 'Unauthorized mutation', argument_name: nil
  )
    field_name = model_class.name.underscore
    attr_reader field_name

    define_method :authorized? do |args|
      model = model_class.find_by!(id_field => args[argument_name || id_field])
      instance_variable_set(:"@#{field_name}", model)
      self.class.check_authorization(policy(model), action, message: message)
    end
  end

  def self.load_and_authorize_convention_associated_model(
    association, id_field, action, message: 'Unauthorized mutation'
  )
    reflection = Convention.reflect_on_association(association)
    raise NameError, "No association called #{association} on Convention" unless reflection
    field_name = reflection.name.to_s.singularize.underscore
    attr_reader field_name

    define_method :authorized? do |args|
      model = convention.public_send(association).find_by!(id_field => args[id_field])
      instance_variable_set(:"@#{field_name}", model)
      self.class.check_authorization(policy(model), action, message: message)
    end
  end

  def self.authorize_arbitrary_convention_associated_model(
    association, action, message: 'Unauthorized mutation'
  )
    define_method :authorized? do |_args|
      model = convention.public_send(association).new
      self.class.check_authorization(policy(model), action, message: message)
    end
  end

  def self.authorize_arbitrary_cms_model(association, action, message: 'Unauthorized mutation')
    define_method :authorized? do |_args|
      model = cms_parent.public_send(association).new
      self.class.check_authorization(policy(model), action, message: message)
    end
  end

  def self.authorize_create_convention_associated_model(
    association, message: 'Unauthorized mutation'
  )
    authorize_arbitrary_convention_associated_model(association, :create, message: message)
  end

  def self.authorize_create_cms_model(association, message: 'Unauthorized mutation')
    authorize_arbitrary_cms_model(association, :create, message: message)
  end

  def self.load_and_authorize_cms_model(
    association, id_field, action, message: 'Unauthorized mutation'
  )
    # Convention is a CMS parent and we're going to treat it as canonical for these associations
    reflection = Convention.reflect_on_association(association)
    raise NameError, "No association called #{association} on Convention" unless reflection
    field_name = reflection.name.to_s.singularize.underscore
    attr_reader field_name

    define_method :authorized? do |args|
      model = cms_parent.public_send(association).find_by!(id_field => args[id_field])
      instance_variable_set(:"@#{field_name}", model)
      self.class.check_authorization(policy(model), action, message: message)
    end
  end
end
