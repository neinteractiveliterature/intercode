class CmsContentStorageAdapters::CmsGraphqlQueries < CmsContentStorageAdapters::Base
  def subdir
    "graphql_queries"
  end

  def cms_parent_association
    cms_parent.cms_graphql_queries
  end

  def identifier_attribute
    "identifier"
  end

  def filename_pattern
    "*.graphql"
  end

  def identifier_for_path(_content_set, path)
    basename_without_extension(path, ".graphql")
  end

  def path_for_identifier(content_set, identifier)
    content_set.content_path(File.join("graphql_queries", "#{identifier}.graphql"))
  end

  def read_item_attrs(item)
    read_item_with_frontmatter(item, :query)
  end

  def serialize_item(item, io)
    write_content_with_yaml_frontmatter(
      item.model.query,
      item
        .model
        .attributes
        .except("query", "id", "parent_id", "parent_type", "created_at", "updated_at", "identifier")
        .compact,
      io
    )
  end
end
