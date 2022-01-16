class CmsContentPersisters::CmsGraphqlQueries < CmsContentPersisters::Base
  def subdir
    'graphql_queries'
  end

  def cms_parent_association
    cms_parent.cms_graphql_queries
  end

  def identifier_attribute
    'identifier'
  end

  def filename_pattern
    '*.graphql'
  end

  def identifier_for_path(_content_set, path)
    basename_without_extension(path, '.graphql')
  end

  def read_item_attrs(item)
    read_item_with_frontmatter(item, :query)
  end
end
