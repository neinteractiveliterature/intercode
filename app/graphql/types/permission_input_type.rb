# frozen_string_literal: true
class Types::PermissionInputType < Types::BaseInputObject
  argument :model_id, ID, required: false, camelize: true
  argument :model_type, Types::PermissionedModelTypeIndicator, required: false, camelize: false
  argument :permission, String, required: true
  argument :role_id, ID, required: false, camelize: true
  argument :role_type, Types::PermissionedRoleTypeIndicator, required: false, camelize: false

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
        record_class = record_type.safe_constantize
        records_by_id = record_class.find(inputs.pluck(id_field)).index_by { |record| record.id.to_s }
        inputs.map { |input| { association_name => records_by_id[input[id_field]], :permission => input[:permission] } }
      end
  end
end
