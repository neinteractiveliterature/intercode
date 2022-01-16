# frozen_string_literal: true
class CmsContentLoaders::CmsGraphqlQueries < CmsContentLoaders::Base
  private

  def storage_adapter
    @storage_adapter ||= CmsContentStorageAdapters::CmsGraphqlQueries.new(cms_parent, content_set)
  end
end
