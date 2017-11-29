module Concerns::FormMarkdown
  def render_markdown(content)
    liquid = MarkdownPresenter.markdown_processor.render(content || '')
    liquid = MarkdownPresenter.strip_single_p(liquid)
    
    template = Liquid::Template.parse(liquid)
    cadmus_renderer.render(template, :html)
  end
end
