class CmsContentStorageAdapters::CmsFiles < CmsContentStorageAdapters::Base
  def subdir
    'files'
  end

  def cms_parent_association
    cms_parent.cms_files
  end

  def identifier_attribute
    'file'
  end

  def read_item_attrs(item)
    { path: item.path }
  end

  def identifier_for_path(_content_set, path)
    basename_without_extension(path, '')
  end

  def identifier_for_model(model)
    model.file.identifier
  end

  def path_for_identifier(content_set, identifier)
    content_set.content_path(File.join('files', identifier))
  end

  def serialize_item(item, io)
    io.write(item.model.file.read)
  end
end
