# frozen_string_literal: true
class CmsContentLoaders::CmsPartials < CmsContentLoaders::Base
  private

  def storage_adapter
    @storage_adapter ||= CmsContentStorageAdapters::CmsPartials.new(cms_parent, content_set)
  end
end
