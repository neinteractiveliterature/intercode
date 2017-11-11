class LoadCmsContentSetService < ApplicationService
  class CmsContentSet
    attr_reader :name

    def initialize(name:)
      @name = name
    end

    def all_template_paths_with_names(subdir)
      all_template_paths(subdir).map do |template_path|
        [template_path, template_name(template_path)]
      end
    end

    def template_name(path)
      File.basename(path).gsub(/\.liquid\z/, '')
    end

    def template_content(path)
      raw = File.read(path)
      if raw =~ /\A---$(.*)^---$(.*)/m
        regular_content = $2
        frontmatter = $1
        [regular_content.strip, YAML.safe_load(frontmatter).deep_symbolize_keys]
      else
        [raw, {}]
      end
    end

    def all_template_paths(subdir)
      inherited_template_paths = inherit_content_sets.map { |content_set| content_set.all_template_paths(subdir) }
      merge_template_paths(*inherited_template_paths, own_template_paths(subdir))
    end

    def merge_template_paths(*template_path_lists)
      template_path_lists_by_name = template_path_lists.map do |template_path_list|
        template_path_list.index_by { |path| template_name(path) }
      end

      template_path_lists_by_name.inject(&:merge).values
    end

    def own_template_paths(subdir)
      Dir[content_path(subdir, "**", "*.liquid")]
    end

    def content_path(*parts)
      File.expand_path(File.join(*parts), root_path)
    end

    def metadata
      @metadata ||= begin
        metadata_path = content_path('metadata.yml')
        if File.exist?(metadata_path)
          YAML.safe_load(File.read(metadata_path)).deep_symbolize_keys
        else
          {}
        end
      end
    end

    def inherit_content_sets
      return [] unless metadata[:inherit]

      @inherit_content_sets ||= begin
        metadata[:inherit].map { |content_set_name| CmsContentSet.new(name: content_set_name) }
      end
    end

    def root_path
      File.expand_path(File.join('cms_content_sets', name), Rails.root)
    end
  end

  attr_reader :convention, :content_set, :content_set_name

  validates_presence_of :convention, :content_set_name
  validate :ensure_content_set_exists
  validate :ensure_no_conflicting_pages
  validate :ensure_no_conflicting_partials
  validate :ensure_no_conflicting_layouts

  def initialize(convention:, content_set_name:)
    @convention = convention
    @content_set_name = content_set_name
    @content_set = CmsContentSet.new(name: content_set_name)
  end

  private

  def inner_call
    content_set.all_template_paths_with_names('layouts').each do |path, name|
      content, attrs = content_set.template_content(path)
      cms_layout = @convention.cms_layouts.create!(name: name, content: content, **attrs)
      @convention.update!(default_layout: cms_layout) if name == 'Default'
    end

    content_set.all_template_paths_with_names('pages').each do |path, name|
      content, attrs = content_set.template_content(path)
      page = @convention.pages.create!(name: name, content: content, **attrs)
      @convention.update!(root_page: page) if name == 'root'
    end

    content_set.all_template_paths_with_names('partials').each do |path, name|
      content, attrs = content_set.template_content(path)
      @convention.cms_partials.create!(name: name, content: content, **attrs)
    end

    success
  end

  def ensure_content_set_exists
    errors.add(:base, "No content set found at #{content_set.root_path}") unless Dir.exist?(content_set.root_path)
  end

  def ensure_no_conflicting_pages
    return unless convention && content_set_name

    ensure_no_conflicting_content('pages', convention.pages.pluck(:name))

    if content_set.all_template_paths_with_names('pages').map(&:last).include?('root') && convention.root_page
      errors.add(:base, "#{convention.name} already has a root page")
    end
  end

  def ensure_no_conflicting_partials
    return unless convention && content_set_name

    ensure_no_conflicting_content('partials', convention.cms_partials.pluck(:name))
  end

  def ensure_no_conflicting_layouts
    return unless convention && content_set_name

    ensure_no_conflicting_content('layouts', convention.cms_layouts.pluck(:name))

    if content_set.all_template_paths_with_names('layouts').map(&:last).include?('Default') && convention.default_layout
      errors.add(:base, "#{convention.name} already has a default layout")
    end
  end

  def ensure_no_conflicting_content(subdir, content_identifiers)
    content_identifiers = Set.new(content_identifiers)

    content_set.all_template_paths_with_names(subdir).each do |_path, name|
      if content_identifiers.include?(name)
        errors.add(:base, "A #{subdir.singularize} named #{name} already exists in #{convention.name}")
      end
    end
  end
end
