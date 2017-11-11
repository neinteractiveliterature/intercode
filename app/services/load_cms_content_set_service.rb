class LoadCmsContentSetService < ApplicationService
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
