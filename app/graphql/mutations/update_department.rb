# frozen_string_literal: true
class Mutations::UpdateDepartment < Mutations::BaseMutation
  graphql_name 'UpdateDepartment'

  field :department, Types::DepartmentType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :department, Types::DepartmentInputType, required: true, camelize: false

  load_and_authorize_convention_associated_model :departments, :id, :update

  def resolve(**args)
    department.update!(args[:department].to_h)

    { department: department }
  end
end
