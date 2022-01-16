class CmsContentStorageAdapters::Base
  class ItemInfo
    attr_reader :content_set, :path, :identifier

    def initialize(content_set:, path:, identifier:)
      @content_set = content_set
      @path = path
      @identifier = identifier
    end
  end

  attr_reader :cms_parent, :cms_content_set

  def initialize(cms_parent, cms_content_set)
    @cms_parent = cms_parent
    @cms_content_set = cms_content_set
  end

  def subdir
    raise NotImplementedError, 'CmsContentStorageAdapters::Base subclasses must implement #subdir'
  end

  def identifier_attribute
    raise NotImplementedError, 'CmsContentStorageAdapters::Base subclasses must implement #identifier_attribute'
  end

  def cms_parent_association
    raise NotImplementedError, 'CmsContentStorageAdapters::Base subclasses must implement #cms_parent_association'
  end

  def identifier_for_path(_content_set, _path)
    raise NotImplementedError, 'CmsContentStorageAdapters::Base subclasses must implement #identifier_for_path'
  end

  def read_item_attrs(_item)
    raise NotImplementedError, 'CmsContentStorageAdapters::Base subclasses must implement #read_item_attrs'
  end

  def filename_pattern
    '*'
  end

  def own_paths_from_disk_for_cms_content_set(content_set)
    Dir[content_set.content_path(subdir, '**', filename_pattern)]
  end

  def own_items_from_disk_for_cms_content_set(content_set)
    own_paths_from_disk_for_cms_content_set(content_set).map do |path|
      ItemInfo.new(content_set: content_set, path: path, identifier: identifier_for_path(content_set, path))
    end
  end

  def own_items_from_disk
    own_items_from_disk_for_cms_content_set(cms_content_set)
  end

  def all_items_from_disk
    item_lists =
      (cms_content_set.inherit_content_sets + [cms_content_set]).map do |content_set|
        own_items_from_disk_for_cms_content_set(content_set)
      end
    merge_items(item_lists)
  end

  def merge_items(item_lists)
    item_lists_by_identifier = item_lists.map { |item_list| item_list.index_by(&:identifier) }
    item_lists_by_identifier.inject(&:merge).values
  end

  def basename_without_extension(path, extension)
    root_relative_path = Pathname.new(path).relative_path_from(CmsContentSet.root_path)
    base_path = File.join(root_relative_path.each_filename.to_a.slice(2..-1))
    base_path.gsub(/#{Regexp.escape extension}\z/, '')
  end

  def parse_content_with_yaml_frontmatter(raw)
    if raw =~ /\A---$(.*)^---$(.*)/m
      regular_content = Regexp.last_match(2)
      frontmatter = Regexp.last_match(1)
      [regular_content, YAML.safe_load(frontmatter).deep_symbolize_keys]
    else
      [raw, {}]
    end
  end

  def read_item_with_frontmatter(item, content_attribute)
    raw = File.read(item.path)
    content, metadata = parse_content_with_yaml_frontmatter(raw)
    { content_attribute.to_sym => content, **metadata }
  end
end
