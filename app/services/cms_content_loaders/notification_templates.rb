# frozen_string_literal: true
class CmsContentLoaders::NotificationTemplates < CmsContentLoaders::Base
  private

  def storage_adapter
    @storage_adapter ||= CmsContentStorageAdapters::NotificationTemplates.new(cms_parent, content_set)
  end
end
