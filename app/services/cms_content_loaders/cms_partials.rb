# frozen_string_literal: true
class CmsContentLoaders::CmsPartials < CmsContentLoaders::Base
  private

  def persister
    @persister ||= CmsContentPersisters::CmsPartials.new(cms_parent, content_set)
  end
end
