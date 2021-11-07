# frozen_string_literal: true
class Mutations::DeleteForm < Mutations::BaseMutation
  field :form, Types::FormType, null: false, camelize: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :forms, :id, :destroy

  def resolve(**_args)
    form.destroy!
    { form: form }
  end
end
