Types::FormType = GraphQL::ObjectType.define do
  name 'FormType'

  field :id, !types.Int
  field :form_api_json, !types.String do
    resolve ->(obj, _args, ctx) do
      FormApiPresenter.new(obj, ctx[:cadmus_renderer]).as_json.to_json
    end
  end
  field :export_json, !types.String do
    resolve ->(obj, _args, _ctx) {
      FormExportPresenter.new(obj).as_json.to_json
    }
  end
end
