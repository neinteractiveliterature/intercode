class CmsContentStorageAdapters::Pages < CmsContentStorageAdapters::Base
  def subdir
    "pages"
  end

  def cms_parent_association
    cms_parent.pages
  end

  def identifier_attribute
    "slug"
  end

  def filename_pattern
    "*.liquid"
  end

  def identifier_for_path(_content_set, path)
    basename_without_extension(path, ".liquid")
  end

  def path_for_identifier(content_set, identifier)
    content_set.content_path(File.join("pages", "#{identifier}.liquid"))
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
        .except(
          "content",
          "id",
          "parent_id",
          "cms_layout_id",
          "parent_type",
          "created_at",
          "updated_at",
          "slug",
          "invariant"
        )
        .merge("layout_name" => item.model.cms_layout&.name)
        .compact,
      io
    )
  end
end
