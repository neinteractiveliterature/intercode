# frozen_string_literal: true
class Mutations::UpdateDepartment < Mutations::BaseMutation
  graphql_name "UpdateDepartment"

  field :department, Types::DepartmentType, null: false

  argument :department, Types::DepartmentInputType, required: true, camelize: false
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :departments, :id, :update

  def resolve(**args)
    department.update!(args[:department].to_h)

    { department: }
  end
end
