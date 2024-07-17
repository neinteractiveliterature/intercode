# frozen_string_literal: true
class Mutations::DeleteCmsVariable < Mutations::BaseMutation
  field :cms_variable, Types::CmsVariable, null: false, camelize: false

  argument :key, String, required: true

  load_and_authorize_cms_model :cms_variables, :key, :destroy

  def resolve(**_args)
    cms_variable.destroy!

    { cms_variable: cms_variable }
  end
end
