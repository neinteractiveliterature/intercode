# frozen_string_literal: true
class Mutations::DeleteFormSection < Mutations::BaseMutation
  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_model_with_id FormSection, :id, :destroy

  def resolve(**_args)
    config = Form::FORM_TYPE_CONFIG[form_section.form.form_type]
    required_items =
      form_section.form_items.filter_map do |form_item|
        standard_item = config['standard_items'][form_item.identifier]
        standard_item if standard_item && standard_item['required']
      end

    if required_items.any?
      item_descriptions = required_items.map { |standard_item| standard_item['description'] }
      raise GraphQL::ExecutionError, "#{item_descriptions.to_sentence.capitalize} required for #{config['description']}"
    end

    form_section.destroy!
    {}
  end
end
