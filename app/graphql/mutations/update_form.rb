# frozen_string_literal: true
class Mutations::UpdateForm < Mutations::BaseMutation
  field :form, Types::FormType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :form, Types::FormInputType, required: true, camelize: false

  load_and_authorize_model_with_id Form, :id, :update

  def resolve(**args)
    form.update!(args[:form].to_h)

    { form: form }
  end
end
