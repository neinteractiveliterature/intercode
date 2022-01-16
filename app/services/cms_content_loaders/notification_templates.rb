# frozen_string_literal: true
class CmsContentLoaders::NotificationTemplates < CmsContentLoaders::Base
  private

  def persister
    @persister ||= CmsContentPersisters::NotificationTemplates.new(cms_parent, content_set)
  end
end
