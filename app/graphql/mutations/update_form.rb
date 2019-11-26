class Mutations::UpdateForm < Mutations::BaseMutation
  field :form, Types::FormType, null: false

  argument :id, Integer, required: true
  argument :form, Types::FormInputType, required: true, camelize: false

  load_and_authorize_model_with_id Form, :id, :update

  def resolve(**args)
    form.update!(args[:form].to_h)

    { form: form }
  end
end
