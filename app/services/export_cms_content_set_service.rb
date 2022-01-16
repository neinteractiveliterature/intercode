# frozen_string_literal: true
class ExportCmsContentSetService < CivilService::Service
  attr_reader :convention, :content_set, :content_set_name, :inherit

  validates_presence_of :convention, :content_set_name
  validate :ensure_no_conflicting_folder

  def initialize(convention:, content_set_name:, inherit: ['standard'])
    @convention = convention
    @content_set_name = content_set_name
    @content_set = CmsContentSet.new(name: content_set_name)
    @inherit = inherit
  end

  private

  def inner_call
    Dir.mkdir(content_set.root_path)

    export_metadata

    [
      CmsContentStorageAdapters::CmsLayouts,
      CmsContentStorageAdapters::Pages,
      CmsContentStorageAdapters::CmsPartials,
      CmsContentStorageAdapters::NotificationTemplates,
      CmsContentStorageAdapters::CmsFiles,
      CmsContentStorageAdapters::Forms
    ].each { |adapter_class| export_content_from_adapter(adapter_class.new(convention, content_set)) }

    success
  end

  def export_content_from_adapter(storage_adapter)
    inherited_items =
      storage_adapter
        .merge_items(
          inherited_content_sets.map do |inherited_content_set|
            storage_adapter.class.new(storage_adapter.cms_parent, inherited_content_set).all_items_from_disk
          end
        )
        .index_by(&:identifier)

    storage_adapter.all_items_from_database.each do |item|
      inherited_item = inherited_items[item.identifier]

      if inherited_item
        own_content = StringIO.new.tap { |io| storage_adapter.serialize_item(item, io) }.string
        inherited_content = File.read(inherited_item.path)
        next if own_content == inherited_content

        export_item(item) { |io| io.write(own_content) }
      else
        export_item(item) { |io| storage_adapter.serialize_item(item, io) }
      end
    end
  end

  def export_metadata
    File.open(File.expand_path('metadata.yml', content_set.root_path), 'w') do |f|
      metadata = {
        'inherit' => inherit,
        'navigation_items' => serialize_root_navigation_items,
        'root_page_slug' => convention.root_page&.slug,
        'default_layout_name' => convention.default_layout&.name,
        'variables' => serialize_variables
      }.compact

      f.write(YAML.dump(metadata))
    end
  end

  def export_item(item, &block)
    FileUtils.mkdir_p(File.dirname(item.path))
    File.open(item.path, 'wb', &block)
  end

  def serialize_root_navigation_items
    serialize_navigation_items(convention.cms_navigation_items.root.order(:position))
  end

  def serialize_navigation_items(items)
    items.map do |item|
      {
        'item_type' => item.item_type,
        'title' => item.title,
        'page_slug' => item.page&.slug,
        'navigation_links' => serialize_navigation_items(item.navigation_links.order(:position)).presence
      }.compact
    end
  end

  def serialize_variables
    convention.cms_variables.order(:key).each_with_object({}) { |variable, hash| hash[variable.key] = variable.value }
  end

  def inherited_content_sets
    @inherit_content_sets ||= inherit.map { |content_set_name| CmsContentSet.new(name: content_set_name) }
  end

  def ensure_no_conflicting_folder
    return unless Dir.exist?(content_set.root_path)
    errors.add(:base, "Folder called #{content_set.root_path} already exists")
  end
end
