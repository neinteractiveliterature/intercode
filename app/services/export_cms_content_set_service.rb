class ExportCmsContentSetService < ApplicationService
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
    export_content_for_subdir('layouts', convention.cms_layouts)
    export_content_for_subdir('pages', convention.pages)
    export_content_for_subdir('partials', convention.cms_partials)
    export_form_content

    success
  end

  def export_metadata
    File.open(File.expand_path('metadata.yml', content_set.root_path), 'w') do |f|
      metadata = {
        inherit: inherit
      }

      f.write(YAML.dump(metadata))
    end
  end

  def export_form_content
    Dir.mkdir(File.expand_path('forms', content_set.root_path))

    LoadCmsContentSetService::FORM_NAMES.each do |form_name|
      form = convention.public_send(form_name)
      next unless form

      content = FormExportPresenter.new(form).as_json
      inherited_content = inherited_form_content_for(form_name)
      next if JSON.pretty_generate(content) == JSON.pretty_generate(inherited_content)

      path = File.expand_path("forms/#{form_name}.json", content_set.root_path)
      File.open(path, 'w') do |f|
        f.write(JSON.pretty_generate(content))
      end
    end
  end

  def export_content_for_subdir(subdir, content)
    Dir.mkdir(File.expand_path(subdir, content_set.root_path))

    content.each do |model|
      path = File.expand_path("#{subdir}/#{model.name}.liquid", content_set.root_path)
      frontmatter_attrs = frontmatter_for_content(model)
      inherited_content = inherited_template_content_for(subdir, model.name)
      next if [model.content, frontmatter_attrs] == inherited_content

      write_template_content(model, frontmatter_attrs, path)
    end
  end

  def write_template_content(model, frontmatter_attrs, path)
    File.open(path, 'w') do |f|
      if frontmatter_attrs.present?
        f.write(YAML.dump(frontmatter_attrs))
        f.write("---\n")
      end

      f.write(model.content)
    end
  end

  def frontmatter_for_content(model)
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

    frontmatter_attrs
  end

  def inherited_content_sets
    @inherit_content_sets ||= inherit.map do |content_set_name|
      CmsContentSet.new(name: content_set_name)
    end
  end

  def inherited_form_content_for(name)
    content_set = inherited_content_sets.find do |cs|
      target_path = cs.content_path('forms', "#{name}.json")
      cs.own_form_paths.include?(target_path)
    end
    return unless content_set

    JSON.parse(File.read(content_set.content_path('forms', "#{name}.json")))
  end

  def inherited_template_content_for(subdir, name)
    content_set = inherited_content_sets.find do |cs|
      target_path = cs.content_path(subdir, "#{name}.liquid")
      cs.own_template_paths(subdir).include?(target_path)
    end
    return unless content_set

    content_set.template_content(content_set.content_path(subdir, "#{name}.liquid"))
  end

  def ensure_no_conflicting_folder
    return unless Dir.exist?(content_set.root_path)
    errors.add(:base, "Folder called #{content_set.root_path} already exists")
  end
end
