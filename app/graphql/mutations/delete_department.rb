# frozen_string_literal: true
class Mutations::DeleteDepartment < Mutations::BaseMutation
  graphql_name 'DeleteDepartment'

  field :department, Types::DepartmentType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_convention_associated_model :departments, :id, :destroy

  def resolve(**_args)
    department.destroy!

    { department: department }
  end
end
