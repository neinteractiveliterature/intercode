class CmsPageContentLoader < GraphQL::Batch::Loader
  attr_reader :cms_rendering_context

  def initialize(cms_rendering_context)
    @cms_rendering_context = cms_rendering_context
  end

  def perform(keys)
    invariant_pages, variant_pages = keys.partition(&:invariant?)
    invariant_pages_by_cache_key = invariant_pages.index_by { |page| cache_key_for_page(page) }

    rendered_content = Rails.cache.fetch_multi(*invariant_pages_by_cache_key.keys) do |key|
      cms_rendering_context.render_page_content(invariant_pages_by_cache_key[key])
    end

    cms_rendering_context.preload_page_content(*variant_pages)

    rendered_content.update(
      variant_pages.index_by { |page| cache_key_for_page(page) }.transform_values do |page|
        cms_rendering_context.render_page_content(page)
      end
    )

    keys.each do |page|
      fulfill(page, rendered_content[cache_key_for_page(page)])
    end
  end

  private

  def cache_key_for_page(page)
    [cms_parent, page]
  end

  def cms_parent
    @cms_parent ||= cms_rendering_context.cms_parent
  end
end
