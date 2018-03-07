class ExportCmsContentSetService < ApplicationService
  attr_reader :convention, :content_set, :content_set_name

  validates_presence_of :convention, :content_set_name
  validate :ensure_no_conflicting_folder

  def initialize(convention:, content_set_name:)
    @convention = convention
    @content_set_name = content_set_name
    @content_set = CmsContentSet.new(name: content_set_name)
  end

  private

  def inner_call
    Dir.mkdir(content_set.root_path)

    export_content_for_subdir('layouts', convention.cms_layouts)
    export_content_for_subdir('pages', convention.pages)
    export_content_for_subdir('partials', convention.cms_partials)
    export_form_content

    success
  end

  def export_form_content
    Dir.mkdir(File.expand_path('forms', content_set.root_path))

    LoadCmsContentSetService::FORM_NAMES.each do |form_name|
      form = convention.public_send(form_name)
      next unless form

      path = File.expand_path("forms/#{form_name}.json", content_set.root_path)
      File.open(path, 'w') do |f|
        f.write(JSON.pretty_generate(FormExportPresenter.new(form).as_json))
      end
    end
  end

  def export_content_for_subdir(subdir, content)
    Dir.mkdir(File.expand_path(subdir, content_set.root_path))

    content.each do |model|
      path = File.expand_path("#{subdir}/#{model.name}.liquid", content_set.root_path)
      File.open(path, 'w') do |f|
        frontmatter_attrs = model.attributes.except(
          'content',
          'id',
          'name',
          'parent_id',
          'parent_type',
          'cms_layout_id',
          'created_at',
          'updated_at'
        ).compact

        if Cadmus::Slugs.slugify(model.name) == frontmatter_attrs['slug']
          frontmatter_attrs.delete('slug')
        end

        if frontmatter_attrs.present?
          f.write(YAML.dump(frontmatter_attrs))
          f.write("---\n")
        end

        f.write(model.content)
      end
    end
  end

  def load_content_for_subdir(subdir, &block)
    content_set.all_template_paths_with_names(subdir).each do |path, name|
      content, attrs = content_set.template_content(path)
      model = association_for_subdir(subdir).create!(name: name, content: content, **attrs)

      block.call(model) if block
    end
  end

  def create_form(association_name)
    convention.public_send("create_#{association_name}!", convention: convention)
  end

  def association_for_subdir(subdir)
    case subdir
    when 'layouts' then convention.cms_layouts
    when 'pages' then convention.pages
    when 'partials' then convention.cms_partials
    else raise "Unknown content type: #{subdir}"
    end
  end

  def ensure_no_conflicting_folder
    return unless Dir.exist?(content_set.root_path)
    errors.add(:base, "Folder called #{content_set.root_path} already exists")
  end
end
