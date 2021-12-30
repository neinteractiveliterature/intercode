# frozen_string_literal: true
module FormMarkdown
  def render_markdown(content)
    MarkdownPresenter
      .new('', cadmus_renderer: cadmus_renderer)
      .render(content, sanitize_content: false, filter_liquid_tags: false)
  end
end
