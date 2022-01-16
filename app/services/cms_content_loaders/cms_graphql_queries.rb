# frozen_string_literal: true
class CmsContentLoaders::CmsGraphqlQueries < CmsContentLoaders::Base
  private

  def persister
    @persister ||= CmsContentPersisters::CmsGraphqlQueries.new(cms_parent, content_set)
  end
end
