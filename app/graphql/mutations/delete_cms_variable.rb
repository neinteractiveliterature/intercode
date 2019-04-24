class Mutations::DeleteCmsVariable < Mutations::BaseMutation
  field :cms_variable, Types::CmsVariable, null: false, camelize: false

  argument :key, String, required: true

  def resolve(key:)
    variable = cms_parent.cms_variables.find_by!(key: key)
    variable.destroy!

    { cms_variable: variable }
  end
end
