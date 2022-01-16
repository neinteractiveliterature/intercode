# frozen_string_literal: true
class CmsContentLoaders::Pages < CmsContentLoaders::Base
  private

  def inner_call
    super

    return success unless content_set.metadata[:root_page_slug]
    cms_parent.update!(root_page: cms_parent.pages.find_by(slug: content_set.metadata[:root_page_slug]))

    success
  end

  def storage_adapter
    @storage_adapter ||= CmsContentStorageAdapters::Pages.new(cms_parent, content_set)
  end

  def taken_special_identifiers
    cms_parent.root_page ? { 'root' => 'root page' } : {}
  end
end
