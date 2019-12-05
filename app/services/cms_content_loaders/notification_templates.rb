class CmsContentLoaders::NotificationTemplates < CmsContentLoaders::Base
  private

  def subdir
    'notification_templates'
  end

  def convention_association
    convention.notification_templates
  end

  def identifier_attribute
    'event_key'
  end

  def content_attribute
    'body'
  end
end
