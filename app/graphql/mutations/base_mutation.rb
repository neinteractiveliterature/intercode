class Mutations::BaseMutation < GraphQL::Schema::RelayClassicMutation
  include Concerns::ContextAccessors

  field_class Types::UncamelizedField

  def self.require_user_con_profile
    define_method :authorized? do |_args|
      !!user_con_profile
    end
  end

  def self.load_and_authorize_model_with_id(model_class, id_field, action)
    field_name = model_class.name.underscore
    attr_reader field_name

    define_method :authorized? do |args|
      model = model_class.find_by!(id_field => args[id_field])
      instance_variable_set(:"@#{field_name}", model)
      policy(model).public_send("#{action}?")
    end
  end

  def self.load_and_authorize_convention_associated_model(association, id_field, action)
    reflection = Convention.reflect_on_association(association)
    raise NameError, "No association called #{association} on Convention" unless reflection
    field_name = reflection.name.to_s.singularize.underscore
    attr_reader field_name

    define_method :authorized? do |args|
      model = convention.public_send(association).find_by!(id_field => args[id_field])
      instance_variable_set(:"@#{field_name}", model)
      policy(model).public_send("#{action}?")
    end
  end

  def self.authorize_arbitrary_convention_associated_model(association, action)
    define_method :authorized? do |_args|
      model = convention.public_send(association).new
      policy(model).public_send("#{action}?")
    end
  end

  def self.authorize_arbitrary_cms_model(association, action)
    define_method :authorized? do |_args|
      model = cms_parent.public_send(association).new
      policy(model).public_send("#{action}?")
    end
  end

  def self.authorize_create_convention_associated_model(association)
    authorize_arbitrary_convention_associated_model(association, :create)
  end

  def self.authorize_create_cms_model(association)
    authorize_arbitrary_cms_model(association, :create)
  end

  def self.load_and_authorize_cms_model(association, id_field, action)
    # Convention is a CMS parent and we're going to treat it as canonical for these associations
    reflection = Convention.reflect_on_association(association)
    raise NameError, "No association called #{association} on Convention" unless reflection
    field_name = reflection.name.to_s.singularize.underscore
    attr_reader field_name

    define_method :authorized? do |args|
      model = cms_parent.public_send(association).find_by!(id_field => args[id_field])
      instance_variable_set(:"@#{field_name}", model)
      policy(model).public_send("#{action}?")
    end
  end
end
