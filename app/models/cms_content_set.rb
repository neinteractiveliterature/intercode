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

  def all_template_names(subdir)
    all_template_paths_with_names(subdir).map(&:last)
  end

  def template_name(path)
    File.basename(path).gsub(/\.liquid\z/, '')
  end

  def template_content(path)
    raw = File.read(path)
    if raw =~ /\A---$(.*)^---$(.*)/m
      regular_content = Regexp.last_match(2)
      frontmatter = Regexp.last_match(1)
      [regular_content.strip, YAML.safe_load(frontmatter).deep_symbolize_keys]
    else
      [raw, {}]
    end
  end

  def all_template_paths(subdir)
    inherited_template_paths = inherit_content_sets.map do |content_set|
      content_set.all_template_paths(subdir)
    end
    merge_template_paths(*inherited_template_paths, own_template_paths(subdir))
  end

  def merge_template_paths(*template_path_lists)
    template_path_lists_by_name = template_path_lists.map do |template_path_list|
      template_path_list.index_by { |path| template_name(path) }
    end

    template_path_lists_by_name.inject(&:merge).values
  end

  def own_template_paths(subdir)
    Dir[content_path(subdir, '**', '*.liquid')]
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
