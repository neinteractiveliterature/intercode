class Sources::CmsPageContent < GraphQL::Dataloader::Source
  attr_reader :cms_rendering_context

  def initialize(cms_rendering_context)
    @cms_rendering_context = cms_rendering_context
  end

  def fetch(pages)
    rendered_content =
      pages
        .index_by { |page| cache_key_for_page(page) }
        .transform_values { |page| cms_rendering_context.render_page_content(page) }

    pages.map { |page| rendered_content[cache_key_for_page(page)] }
  end

  private

  def cache_key_for_page(page)
    [cms_parent, page]
  end

  def cms_parent
    @cms_parent ||= cms_rendering_context.cms_parent
  end
end
