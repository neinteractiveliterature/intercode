class CmsContentStorageAdapters::CmsLayouts < CmsContentStorageAdapters::Base
  def subdir
    'layouts'
  end

  def cms_parent_association
    cms_parent.cms_layouts
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
