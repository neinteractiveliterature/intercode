class CmsContentPersisters::CmsPartials < CmsContentPersisters::Base
  def subdir
    'partials'
  end

  def cms_parent_association
    cms_parent.cms_partials
  end

  def identifier_attribute
    'name'
  end

  def filename_pattern
    '*.liquid'
  end

  def identifier_for_path(_content_set, path)
    basename_without_extension(path, '.liquid')
  end

  def read_item_attrs(item)
    read_item_with_frontmatter(item, :content)
  end
end
