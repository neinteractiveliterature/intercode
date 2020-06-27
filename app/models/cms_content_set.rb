class CmsContentSet
  def self.root_path
    File.expand_path('cms_content_sets', Rails.root)
  end

  attr_reader :name

  def initialize(name:)
    @name = name
  end

  def user_con_profile_form
    @user_con_profile_form ||= begin
      forms = all_form_contents_by_name.values.select do |content|
        content['form_type'] == 'user_con_profile'
      end
      raise 'Content set contains multiple user_con_profile forms' if forms.size > 1
      forms.first
    end
  end

  def all_form_contents_by_name
    @all_forms_by_name ||= begin
      all_form_paths_with_names.each_with_object({}) do |(form_path, form_name), hash|
        hash[form_name] = JSON.parse(File.read(form_path))
      end
    end
  end

  def all_form_paths_with_names
    all_form_paths.map do |form_path|
      [form_path, basename_without_extension(form_path, '.json')]
    end
  end

  def all_template_paths_with_names(subdir)
    all_template_paths(subdir).map do |template_path|
      [template_path, basename_without_extension(template_path, '.liquid')]
    end
  end

  def all_file_paths_with_names
    all_file_paths do |file_path|
      [file_path, File.basename(file_path)]
    end
  end

  def all_form_names
    all_form_paths_with_names.map(&:last)
  end

  def all_template_names(subdir)
    all_template_paths_with_names(subdir).map(&:last)
  end

  def all_file_names
    all_file_paths_with_names.map(&:last)
  end

  def basename_without_extension(path, extension)
    root_relative_path = Pathname.new(path).relative_path_from(CmsContentSet.root_path)
    base_path = File.join(root_relative_path.each_filename.to_a.slice(2..-1))
    base_path.gsub(/#{Regexp.escape extension}\z/, '')
  end

  def template_content(path)
    raw = File.read(path)
    if raw =~ /\A---$(.*)^---$(.*)/m
      regular_content = Regexp.last_match(2)
      frontmatter = Regexp.last_match(1)
      [regular_content.strip, YAML.safe_load(frontmatter).deep_symbolize_keys]
    else
      [raw.strip, {}]
    end
  end

  def all_template_paths(subdir)
    inherited_template_paths = inherit_content_sets.map do |content_set|
      content_set.all_template_paths(subdir)
    end
    merge_paths('.liquid', *inherited_template_paths, own_template_paths(subdir))
  end

  def all_form_paths
    inherited_form_paths = inherit_content_sets.map(&:all_form_paths)
    merge_paths('.json', *inherited_form_paths, own_form_paths)
  end

  def all_file_paths
    inherited_file_paths = inherit_content_sets.map(&:all_file_paths)

    file_lists_by_name = (inherited_file_paths + [own_file_paths]).map do |path_list|
      path_list.index_by { |path| File.basename(path) }
    end
    file_lists_by_name.inject(&:merge).values
  end

  def merge_paths(extension, *path_lists)
    path_lists_by_name = path_lists.map do |path_list|
      path_list.index_by { |path| basename_without_extension(path, extension) }
    end

    path_lists_by_name.inject(&:merge).values
  end

  def own_form_paths
    Dir[content_path('forms', '**', '*.json')]
  end

  def own_template_paths(subdir)
    Dir[content_path(subdir, '**', '*.liquid')]
  end

  def own_file_paths
    Dir[content_path('files', '**', '*')]
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
      metadata[:inherit].flat_map do |content_set_name|
        content_set = CmsContentSet.new(name: content_set_name)
        [content_set, *content_set.inherit_content_sets]
      end
    end
  end

  def root_path
    File.expand_path(name, CmsContentSet.root_path)
  end
end
