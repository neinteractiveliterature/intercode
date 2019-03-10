class Mutations::DeleteForm < Mutations::BaseMutation
  field :form, Types::FormType, null: false, camelize: false

  argument :id, Int, required: true, camelize: false

  def resolve(id:)
    form = context[:convention].forms.find(id)
    form.destroy!

    { form: form }
  end
end
