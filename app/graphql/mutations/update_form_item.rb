# frozen_string_literal: true
class Mutations::UpdateFormItem < Mutations::BaseMutation
  field :form_item, Types::FormItemType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :form_item, Types::FormItemInputType, required: true, camelize: false

  load_and_authorize_model_with_id FormItem, :id, :update

  def resolve(**args)
    form_item.update!(args[:form_item].to_h)

    { form_item: form_item }
  end
end
