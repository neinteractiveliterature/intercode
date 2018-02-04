module Concerns::FormMarkdown
  def render_markdown(content)
    MarkdownPresenter.new('').render(content, sanitize_content: false, whitelist_liquid_tags: false)
  end
end
