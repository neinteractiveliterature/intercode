# frozen_string_literal: true
class Types::FormSectionType < Types::BaseObject
  authorize_record

  field :form, Types::FormType, null: false, camelize: false
  field :form_items, [Types::FormItemType], null: false, camelize: false
  field :id, ID, null: false
  field :position, Int, null: false
  field :title, String, null: true

  field :preview_form_item, Types::FormItemType, null: false do
    argument :form_item,
             Types::FormItemInputType,
             required: true,
             description: "The fields to use for constructing the form item to preview."

    description <<~MARKDOWN
      Given a FormItemInput, returns a preview version of that form item within this section. This
      does not actually save the form item. This is mostly useful because of the
      `rendered_properties` field inside FormItem, which lets clients retrieve
      a rendered HTML version of the Liquid-enabled properties of the form item.
    MARKDOWN
  end

  def preview_form_item(form_item:)
    FormItem.new(form_item.to_h.merge(id: 0, form_section: object, position: 1))
  end

  association_loaders FormSection, :form, :form_items
end
