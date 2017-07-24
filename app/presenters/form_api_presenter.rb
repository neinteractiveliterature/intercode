class FormApiPresenter
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
      form_items: form.form_items.map { |item| form_item_json(item) },
    }
  end

  private

  def form_section_json(section)
    {
      id: section.id,
      title: section.title,
      position: section.position,
    }
  end

  def form_item_json(item)
    properties = item.properties.deep_dup
    if item.item_type == 'static_text'
      properties['content'] = render_markdown(properties['content'])
    elsif properties['caption']
      properties['caption'] = render_markdown(properties['caption'])
    end

    {
      id: item.id,
      form_section_id: item.form_section_id,
      item_type: item.item_type,
      identifier: item.identifier,
      position: item.position,
    }.merge(properties)
  end

  def render_markdown(content)
    liquid = MarkdownPresenter.markdown_processor.render(content || '')

    template = Liquid::Template.parse(liquid)
    cadmus_renderer.render(template, :html)
  end
end