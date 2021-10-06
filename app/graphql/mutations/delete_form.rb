# frozen_string_literal: true
class Mutations::DeleteForm < Mutations::BaseMutation
  field :form, Types::FormType, null: false, camelize: false

  argument :id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_convention_associated_model :forms, :id, :destroy

  def resolve(**_args)
    form.destroy!
    { form: form }
  end
end
