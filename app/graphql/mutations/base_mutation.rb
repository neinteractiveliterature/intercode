class Mutations::BaseMutation < GraphQL::Schema::RelayClassicMutation
  include Concerns::ContextAccessors

  field_class Types::BaseField

  def self.load_and_authorize_model_with_id(model_class, id_field, action)
    field_name = model_class.name.underscore
    attr_reader field_name

    define_method :authorized? do |args|
      model = model_class.find_by!(id_field => args[id_field])
      instance_variable_set(:"@#{field_name}", model)
      policy(model).public_send("#{action}?")
    end
  end
end
