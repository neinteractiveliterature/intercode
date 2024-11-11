class CmsContentStorageAdapters::CmsPartials < CmsContentStorageAdapters::Base
  def subdir
    "partials"
  end

  def cms_parent_association
    cms_parent.cms_partials
  end

  def identifier_attribute
    "name"
  end

  def filename_pattern
    "*.liquid"
  end

  def identifier_for_path(_content_set, path)
    basename_without_extension(path, ".liquid")
  end

  def path_for_identifier(content_set, identifier)
    content_set.content_path(File.join("partials", "#{identifier}.liquid"))
  end

  def read_item_attrs(item)
    read_item_with_frontmatter(item, :content)
  end

  def serialize_item(item, io)
    write_content_with_yaml_frontmatter(
      item.model.content.gsub("\r\n", "\n"),
      item
        .model
        .attributes
        .except("content", "id", "parent_id", "parent_type", "created_at", "updated_at", "name")
        .compact,
      io
    )
  end
end
