# frozen_string_literal: true
class Mutations::DeleteFormItem < Mutations::BaseMutation
  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_model_with_id FormItem, :id, :destroy

  def resolve(**_args)
    config = Form::FORM_TYPE_CONFIG[form_item.form.form_type]
    standard_item = config['standard_items'][form_item.identifier]
    if standard_item && standard_item['required']
      raise GraphQL::ExecutionError,
            "#{standard_item['description'].capitalize} is required for #{config['description']}"
    end

    form_item.destroy!
    {}
  end
end
