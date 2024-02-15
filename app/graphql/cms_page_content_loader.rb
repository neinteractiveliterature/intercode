# frozen_string_literal: true
class CmsPageContentLoader < GraphQL::Batch::Loader
  attr_reader :cms_rendering_context

  def initialize(cms_rendering_context)
    @cms_rendering_context = cms_rendering_context
  end

  def perform(keys)
    cms_rendering_context.preload_page_content(*keys)

    rendered_content =
      keys
        .index_by { |page| cache_key_for_page(page) }
        .transform_values { |page| cms_rendering_context.render_page_content(page) }

    keys.each { |page| fulfill(page, rendered_content[cache_key_for_page(page)]) }
  end

  private

  def cache_key_for_page(page)
    [cms_parent, page]
  end

  def cms_parent
    @cms_parent ||= cms_rendering_context.cms_parent
  end
end
