# frozen_string_literal: true
class Mutations::UpdateDepartment < Mutations::BaseMutation
  graphql_name 'UpdateDepartment'

  field :department, Types::DepartmentType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :department, Types::DepartmentInputType, required: true, camelize: false

  load_and_authorize_convention_associated_model :departments, :id, :update

  def resolve(**args)
    department.update!(args[:department].to_h)

    { department: department }
  end
end
