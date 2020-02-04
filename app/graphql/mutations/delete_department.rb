class Mutations::DeleteDepartment < Mutations::BaseMutation
  graphql_name 'DeleteDepartment'

  field :department, Types::DepartmentType, null: false

  argument :id, Integer, required: true

  load_and_authorize_convention_associated_model :departments, :id, :destroy

  def resolve(**_args)
    department.destroy!

    { department: department }
  end
end
