class CmsContentStorageAdapters::NotificationTemplates < CmsContentStorageAdapters::Base
  def subdir
    "notification_templates"
  end

  def cms_parent_association
    cms_parent.notification_templates
  end

  def identifier_attribute
    "event_key"
  end

  def filename_pattern
    "*.liquid"
  end

  def identifier_for_path(_content_set, path)
    basename_without_extension(path, ".liquid")
  end

  def path_for_identifier(content_set, identifier)
    content_set.content_path(File.join("notification_templates", "#{identifier}.liquid"))
  end

  def read_item_attrs(item)
    read_item_with_frontmatter(item, :body_html)
  end

  def serialize_item(item, io)
    write_content_with_yaml_frontmatter(
      item.model.body_html.gsub("\r\n", "\n"),
      item.model.attributes.except("body_html", "id", "convention_id", "created_at", "updated_at", "event_key").compact,
      io
    )
  end
end
