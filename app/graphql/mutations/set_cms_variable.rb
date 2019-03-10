class Mutations::SetCmsVariable < Mutations::BaseMutation
  field :cms_variable, Types::CmsVariable, null: false, camelize: false

  argument :cms_variable, Types::CmsVariableInput, required: true, camelize: false

  def resolve(cms_variable:)
    begin
      value = JSON.parse(cms_variable['value_json'])
    rescue JSON::ParserError => error
      raise BetterRescueMiddleware::UnloggedError.new("Invalid JSON: #{error.message}")
    end

    variable = if context[:convention]
      context[:convention].cms_variables.find_or_initialize_by(key: cms_variable['key'])
    else
      CmsVariable.global.find_or_initialize_by(key: cms_variable['key'])
    end
    variable.value = value
    variable.save!

    { cms_variable: variable }
  end
end
