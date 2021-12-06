# frozen_string_literal: true
class Mutations::UpdateFormItem < Mutations::BaseMutation
  field :form_item, Types::FormItemType, null: false

  argument :id, ID, required: false
  argument :form_item, Types::FormItemInputType, required: true, camelize: false

  load_and_authorize_model_with_id FormItem, :id, :update

  def resolve(**args)
    form_item.update!(args[:form_item].to_h)

    { form_item: form_item }
  end
end
