class Mutations::CreateFormSection < Mutations::BaseMutation
  field :form_section, Types::FormSectionType, null: false

  argument :form_id, Integer, required: false, camelize: false
  argument :form_section, Types::FormSectionInputType, required: true, camelize: false

  attr_reader :form_section

  def authorized?(args)
    form = Form.find(args[:form_id])
    @form_section = form.form_sections.new(args[:form_section].to_h)
    self.class.check_authorization(policy(form_section), :create)
  end

  def resolve(**_args)
    form_section.save!
    { form_section: form_section }
  end
end
