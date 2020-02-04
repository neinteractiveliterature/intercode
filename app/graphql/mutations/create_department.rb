class Mutations::CreateDepartment < Mutations::BaseMutation
  graphql_name 'CreateDepartment'

  field :department, Types::DepartmentType, null: false

  argument :department, Types::DepartmentInputType, required: true, camelize: false

  authorize_create_convention_associated_model :departments

  def resolve(**args)
    department = convention.departments.create!(args[:department].to_h)

    { department: department }
  end
end
