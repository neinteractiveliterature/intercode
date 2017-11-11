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
    load_content_for_subdir('layouts') do |cms_layout|
      @convention.update!(default_layout: cms_layout) if cms_layout.name == 'Default'
    end

    load_content_for_subdir('pages') do |page|
      @convention.update!(root_page: page) if page.name == 'root'
    end

    load_content_for_subdir('partials')

    success
  end

  def load_content_for_subdir(subdir, &block)
    content_set.all_template_paths_with_names(subdir).each do |path, name|
      content, attrs = content_set.template_content(path)
      model = association_for_subdir(subdir).create!(name: name, content: content, **attrs)

      block.call(model) if block
    end
  end

  def association_for_subdir(subdir)
    case subdir
    when 'layouts' then @convention.cms_layouts
    when 'pages' then @convention.pages
    when 'partials' then @convention.cms_partials
    else raise "Unknown content type: #{subdir}"
    end
  end

  def ensure_content_set_exists
    errors.add(:base, "No content set found at #{content_set.root_path}") unless Dir.exist?(content_set.root_path)
  end

  def ensure_no_conflicting_pages
    ensure_no_conflicting_content(
      'pages',
      convention.pages.pluck(:name),
      (
        convention.root_page ?
        { 'root' => 'root page' } :
        {}
      )
    )
  end

  def ensure_no_conflicting_partials
    ensure_no_conflicting_content('partials', convention.cms_partials.pluck(:name))
  end

  def ensure_no_conflicting_layouts
    ensure_no_conflicting_content(
      'layouts',
      convention.cms_layouts.pluck(:name),
      (
        convention.default_layout ?
        { 'Default' => 'default layout' } :
        {}
      )
    )
  end

  def ensure_no_conflicting_content(subdir, content_identifiers, taken_special_identifiers = {})
    content_identifiers = Set.new(content_identifiers)

    content_set.all_template_names(subdir).each do |name|
      if taken_special_identifiers[name]
        errors.add(:base, "#{convention.name} already has a #{taken_special_identifiers[name]}")
      end

      if content_identifiers.include?(name)
        errors.add(:base, "A #{subdir.singularize} named #{name} already exists in #{convention.name}")
      end
    end
  end
end
