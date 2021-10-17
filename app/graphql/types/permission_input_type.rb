# frozen_string_literal: true
class Types::PermissionInputType < Types::BaseInputObject
  extend TransitionalIds

  argument :model_type, Types::PermissionedModelTypeIndicator, required: false, camelize: false
  argument :model_id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_model_id, ID, required: false, camelize: true
  argument :role_type, Types::PermissionedRoleTypeIndicator, required: false, camelize: false
  argument :role_id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_role_id, ID, required: false, camelize: true
  argument :permission, String, required: true

  def self.load_permission_input_models(permission_inputs)
    load_permission_input_associations(permission_inputs, :model)
  end

  def self.load_permission_input_roles(permission_inputs)
    load_permission_input_associations(permission_inputs, :role)
  end

  def self.load_permission_input_associations(permission_inputs, association_name)
    type_field = :"#{association_name}_type"
    id_field = :"#{association_name}_id"

    permission_inputs
      .group_by { |input| input[type_field] }
      .flat_map do |record_type, inputs|
        processed_inputs = inputs.map { |input| process_transitional_ids_in_input(input, :model_id, :role_id) }
        record_class = record_type.safe_constantize
        records_by_id = record_class.find(processed_inputs.map { |input| input[id_field] }).index_by(&:id)
        processed_inputs.map do |input|
          { association_name => records_by_id[input[id_field]], :permission => input[:permission] }
        end
      end
  end
end
