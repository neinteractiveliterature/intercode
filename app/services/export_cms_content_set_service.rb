# frozen_string_literal: true
class ExportCmsContentSetService < CivilService::Service
  attr_reader :convention, :content_set, :content_set_name, :inherit

  validates_presence_of :convention, :content_set_name
  validate :ensure_no_conflicting_folder

  def initialize(convention:, content_set_name:, inherit: ["standard"])
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
      CmsContentStorageAdapters::CmsGraphqlQueries,
      CmsContentStorageAdapters::Forms,
      CmsContentStorageAdapters::CmsFiles
    ].each { |adapter_class| export_content_from_adapter(adapter_class.new(convention, content_set)) }

    success
  end

  def export_content_from_adapter(storage_adapter)
    inherited_items =
      storage_adapter.merge_items(
        inherited_content_sets.map do |inherited_content_set|
          storage_adapter.class.new(storage_adapter.cms_parent, inherited_content_set).all_items_from_disk
        end
      ).index_by(&:identifier)

    storage_adapter.all_items_from_database.each do |item|
      next unless item.model
      inherited_item = inherited_items[item.identifier]

      if inherited_item
        inherited_attrs = storage_adapter.read_item_attrs(inherited_item).stringify_keys.transform_values(&:strip)
        own_attrs = item.model.attributes.slice(*inherited_attrs.keys).stringify_keys.transform_values(&:strip)

        if own_attrs == inherited_attrs
          Rails.logger.info(
            "#{storage_adapter.subdir}: No changes from inherited version of #{inherited_item.identifier}"
          )
          next
        end
      end

      export_item(item) { |io| storage_adapter.serialize_item(item, io) }
    end
  end

  def export_metadata
    File.open(File.expand_path("metadata.yml", content_set.root_path), "w") do |f|
      metadata = {
        "inherit" => inherit,
        "navigation_items" => serialize_root_navigation_items,
        "root_page_slug" => convention.root_page&.slug,
        "default_layout_name" => convention.default_layout&.name,
        "variables" => serialize_variables
      }.compact

      f.write(YAML.dump(metadata))
    end
  end

  def export_item(item, &)
    FileUtils.mkdir_p(File.dirname(item.path))
    File.open(item.path, "wb", &)
  end

  def serialize_root_navigation_items
    serialize_navigation_items(convention.cms_navigation_items.root.order(:position))
  end

  def serialize_navigation_items(items)
    items.map do |item|
      {
        "item_type" => item.item_type,
        "title" => item.title,
        "page_slug" => item.page&.slug,
        "navigation_links" => serialize_navigation_items(item.navigation_links.order(:position)).presence
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
