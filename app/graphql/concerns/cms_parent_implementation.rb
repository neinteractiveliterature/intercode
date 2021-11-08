# frozen_string_literal: true
module CmsParentImplementation
  def cms_content_group(id: nil)
    object.cms_content_groups.find(id)
  end

  def cms_page(id: nil, slug: nil, root_page: false)
    return object.root_page if root_page
    return object.pages.find(id) if id
    object.pages.find_by!(slug: slug)
  end

  def effective_cms_layout(path:)
    convention = object.is_a?(Convention) ? object : nil
    CmsContentFinder.new(convention).effective_cms_layout(path)
  end

  def full_text_search(query:)
    SearchResult.full_text_site_search(query, context[:convention]&.id, pundit_user)
  end

  def liquid_assigns
    LiquidAssignGraphqlPresenter.from_hash(cadmus_renderer.default_assigns)
  end

  def preview_markdown(markdown:)
    MarkdownPresenter.new('').render(markdown)
  end

  def preview_liquid(content:)
    cadmus_renderer.render(Liquid::Template.parse(content), :html)
  end

  def typeahead_search_cms_content(name: nil)
    scopes =
      Types::CmsContentType.possible_types.map do |content_type|
        policy_scope(object.public_send(content_type.graphql_name.tableize))
      end

    contents =
      scopes.flat_map do |scope|
        filtered_scope = scope
        filtered_scope = filtered_scope.where('lower(name) like ?', "%#{name.downcase}%") if name.present?

        filtered_scope.limit(10).to_a
      end

    contents.sort_by { |content| [content.name.length, content.name] }
  end

  private

  def cms_rendering_context
    @cms_rendering_context ||= cms_rendering_context_for_cms_parent(object)
  end

  delegate :cadmus_renderer, to: :cms_rendering_context
end
