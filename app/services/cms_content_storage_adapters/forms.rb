class CmsContentStorageAdapters::Forms < CmsContentStorageAdapters::Base
  def subdir
    'forms'
  end

  def cms_parent_association
    cms_parent.forms
  end

  def identifier_attribute
    'title'
  end

  def filename_pattern
    '*.json'
  end

  def identifier_for_path(_content_set, path)
    basename_without_extension(path, '.json')
  end

  def read_item_attrs(item)
    content, metadata = parse_content_with_yaml_frontmatter(File.read(item.path))
    JSON.parse(content).merge(metadata.deep_stringify_keys)
  end
end
