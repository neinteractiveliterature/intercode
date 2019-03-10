class Mutations::DeleteCmsVariable < Mutations::BaseMutation
  field :cms_variable, Types::CmsVariable, null: false, camelize: false

  argument :key, String, required: true

  def resolve(key:)
    variable_scope = if context[:convention]
      context[:convention].cms_variables
    else
      CmsVariable.global
    end

    variable = variable_scope.find_by(key: key)
    variable.destroy!

    { cms_variable: variable }
  end
end
