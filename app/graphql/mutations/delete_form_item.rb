class Mutations::DeleteFormItem < Mutations::BaseMutation
  argument :id, Int, required: true, camelize: false

  load_and_authorize_model_with_id FormItem, :id, :destroy

  def resolve(**_args)
    form_item.destroy!
    {}
  end
end
