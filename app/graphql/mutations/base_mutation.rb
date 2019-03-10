class Mutations::BaseMutation < GraphQL::Schema::RelayClassicMutation
  include Concerns::ContextAccessors

  field_class Types::BaseField
end
