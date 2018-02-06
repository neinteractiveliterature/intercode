module Concerns::FormMarkdown
  def render_markdown(content)
    MarkdownPresenter.new('', cadmus_renderer: cadmus_renderer)
      .render(content, sanitize_content: false, whitelist_liquid_tags: false)
  end
end
