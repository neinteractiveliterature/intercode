# frozen_string_literal: true
class Mutations::UpdateForm < Mutations::BaseMutation
  field :form, Types::FormType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :form, Types::FormInputType, required: true, camelize: false

  load_and_authorize_model_with_id Form, :id, :update

  def resolve(**args)
    form.update!(args[:form].to_h)

    { form: form }
  end
end
