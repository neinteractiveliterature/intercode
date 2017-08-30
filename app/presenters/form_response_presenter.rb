class FormResponsePresenter
  attr_reader :form, :response

  def initialize(form, response)
    @form = form
    @response = response
  end

  def as_json
    form.form_items.each_with_object({}) do |form_item, json|
      field = form_item.identifier.to_s
      next if field.blank?

      json[field] = response.read_form_response_attribute(field)
    end
  end
end
