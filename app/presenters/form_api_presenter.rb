class FormApiPresenter
  include Concerns::FormMarkdown

  attr_reader :form, :cadmus_renderer

  def initialize(form, cadmus_renderer)
    @form = form
    @cadmus_renderer = cadmus_renderer
  end

  def as_json
    {
      id: form.id,
      title: form.title,
      form_sections: form.form_sections.map { |section| form_section_json(section) },
      form_items: form.form_items.map { |item| form_item_json(item) }
    }
  end

  private

  def form_section_json(section)
    {
      id: section.id,
      title: render_markdown(section.title),
      position: section.position
    }
  end

  def form_item_json(item)
    properties = FormItemPresenter.new(item, cadmus_renderer).rendered_properties

    {
      id: item.id,
      form_section_id: item.form_section_id,
      item_type: item.item_type,
      identifier: item.identifier,
      position: item.position
    }.merge(properties)
  end
end
