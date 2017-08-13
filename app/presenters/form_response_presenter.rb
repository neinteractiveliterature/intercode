class FormResponsePresenter
  attr_reader :form, :response

  def initialize(form, response)
    @form = form
    @response = response
  end

  def as_json
    response_attributes = response.attributes.stringify_keys
    additional_info = (response.additional_info || {}).stringify_keys

    form.form_items.each_with_object({}) do |form_item, json|
      field = form_item.identifier.to_s
      next if field.blank?

      if response_attributes.has_key?(field)
        json[form_item.identifier] = response_attributes[field]
      else
        json[form_item.identifier] = additional_info[field]
      end
    end
  end
end
