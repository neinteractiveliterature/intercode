class Types::PermissionInputType < Types::BaseInputObject
  argument :model_type, Types::PermissionedModelTypeIndicator, required: false, camelize: false
  argument :model_id, Int, required: false, camelize: false
  argument :role_type, Types::PermissionedRoleTypeIndicator, required: false, camelize: false
  argument :role_id, Int, required: false, camelize: false
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

    permission_inputs.group_by { |input| input[type_field] }.flat_map do |record_type, inputs|
      record_class = record_type.safe_constantize
      records_by_id = record_class.find(inputs.map { |input| input[id_field] }).index_by(&:id)
      inputs.map do |input|
        { association_name => records_by_id[input[id_field]], permission: input[:permission] }
      end
    end
  end
end
