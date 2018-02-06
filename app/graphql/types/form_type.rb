Types::FormType = GraphQL::ObjectType.define do
  name 'FormType'

  field :id, !types.Int
  field :form_json, !types.String do
    resolve ->(obj, _args, _ctx) {
      FormExportPresenter.new(obj).as_json.to_json
    }
  end
end
