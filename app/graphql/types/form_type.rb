class Types::FormType < Types::BaseObject
  graphql_name 'FormType'

  field :id, Integer, null: false
  field :form_api_json, String, null: false

  def form_api_json
    FormApiPresenter.new(@object, @context[:cadmus_renderer]).as_json.to_json
  end
  field :export_json, String, null: false

  def export_json
    FormExportPresenter.new(@object).as_json.to_json
  end
end
