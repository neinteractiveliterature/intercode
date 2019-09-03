class Types::PermissionInputType < Types::BaseInputObject
  argument :model_type, PermissionedModelTypeIndicator, required: false, camelize: false
  argument :model_id, Int, required: false, camelize: false
  argument :permission, String, required: true

  def self.load_permission_input_models(permission_inputs)
    permission_inputs.group_by { |input| input[:model_type] }.flat_map do |model_type, inputs|
      model_class = model_type.safe_constantize
      model = model_class.find(inputs.map { |input| input[:model_id] })
      { model: model, permission: input[:permission] }
    end
  end
end
