Mutations::UpdateFormWithJSON = GraphQL::Relay::Mutation.define do
  name 'UpdateFormWithJSON'
  return_field :form, Types::FormType

  input_field :id, !types.Int
  input_field :form_json, !types.String

  resolve MutationErrorHandler.new(
    ->(_obj, args, ctx) {
      form = ctx[:convention].forms.find(args[:id])
      ImportFormContentService.new(form: form, content: JSON.parse(args[:form_json])).call!

      { form: form }
    }
  )
end
