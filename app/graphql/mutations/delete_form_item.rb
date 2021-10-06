# frozen_string_literal: true
class Mutations::DeleteFormItem < Mutations::BaseMutation
  argument :id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_id, ID, required: false, camelize: true

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
