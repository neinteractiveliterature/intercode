class LoadCmsContentSetService < ApplicationService
  attr_reader :convention, :content_set_name

  validates_presence_of :convention, :content_set_name
  validate :ensure_content_set_exists
  validate :ensure_no_conflicting_pages
  validate :ensure_no_conflicting_partials

  def initialize(convention:, content_set_name:)
    @convention = convention
    @content_set_name = content_set_name
  end

  private

  def inner_call
    all_template_paths_with_names('pages').each do |path, name|
      page = @convention.pages.create!(name: name, content: template_content(path))
      @convention.update!(root_page: page) if name == 'root'
    end

    all_template_paths_with_names('partials').each do |path, name|
      @convention.cms_partials.create!(identifier: name, content: template_content(path))
    end

    success
  end

  def all_template_paths_with_names(subdir)
    all_template_paths(subdir).map do |template_path|
      [template_path, template_name(subdir, template_path)]
    end
  end

  def template_name(subdir, path)
    subdir_path = Pathname.new(content_path(subdir))
    relative_path = Pathname.new(path).relative_path_from(subdir_path)
    relative_path.to_s.gsub(/\.liquid\z/, '')
  end

  def template_content(path)
    File.read(path)
  end

  def all_template_paths(subdir)
    Dir[content_path(subdir, "**", "*.liquid")]
  end

  def content_path(*parts)
    File.expand_path(File.join(*parts), content_set_root)
  end

  def content_set_root
    File.expand_path(File.join('cms_content_sets', content_set_name), Rails.root)
  end

  def ensure_content_set_exists
    errors.add(:base, "No content set found at #{content_set_root}") unless Dir.exist?(content_set_root)
  end

  def ensure_no_conflicting_pages
    return unless convention && content_set_name

    ensure_no_conflicting_content('pages', convention.pages.pluck(:name))

    if all_template_paths_with_names('pages').map(&:last).include?('root') && convention.root_page
      errors.add(:base, "#{convention.name} already has a root page")
    end
  end

  def ensure_no_conflicting_partials
    return unless convention && content_set_name

    ensure_no_conflicting_content('partials', convention.cms_partials.pluck(:identifier))
  end

  def ensure_no_conflicting_content(subdir, content_identifiers)
    content_identifiers = Set.new(content_identifiers)

    all_template_paths_with_names(subdir).each do |_path, name|
      if content_identifiers.include?(name)
        errors.add(:base, "A #{subdir.singularize} named #{name} already exists in #{convention.name}")
      end
    end
  end
end