class CmsContentStorageAdapters::NotificationTemplates < CmsContentStorageAdapters::Base
  def subdir
    'notification_templates'
  end

  def cms_parent_association
    cms_parent.notification_templates
  end

  def identifier_attribute
    'event_key'
  end

  def filename_pattern
    '*.liquid'
  end

  def identifier_for_path(_content_set, path)
    basename_without_extension(path, '.liquid')
  end

  def read_item_attrs(item)
    read_item_with_frontmatter(item, :body_html)
  end
end
