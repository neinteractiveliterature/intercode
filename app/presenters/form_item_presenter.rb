class FormItemPresenter
  include Concerns::FormMarkdown

  attr_reader :form_item, :cadmus_renderer

  def initialize(form_item, cadmus_renderer)
    @form_item = form_item
    @cadmus_renderer = cadmus_renderer
  end

  def rendered_properties
    properties = form_item.properties.deep_dup
    if form_item.item_type == 'static_text'
      properties['content'] = render_markdown(properties['content'])
    elsif properties['caption']
      properties['caption'] = render_markdown(properties['caption'])
    end

    properties
  end
end
