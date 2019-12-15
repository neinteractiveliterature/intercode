class CmsContentLoaders::Base < CivilService::Service
  validate :ensure_no_conflicting_content

  attr_reader :convention, :content_set, :content_names, :conflict_policy

  def initialize(convention:, content_set:, content_names: nil, conflict_policy: :error)
    @convention = convention
    @content_set = content_set
    @conflict_policy = conflict_policy
    @content_names = content_names
  end

  private

  def inner_call
    load_content
    success
  end

  def load_content(&block)
    content_set.all_template_paths_with_names(subdir).each do |path, name|
      next if content_names.present? && !content_names.include?(name)

      content, attrs = content_set.template_content(path)
      model = load_item(name, content, attrs)
      next if model == :skip

      block.call(model) if block
    end
  end

  def load_item(name, content, attrs)
    if existing_content_identifiers.include?(name)
      return :skip if conflict_policy == :skip

      if conflict_policy == :overwrite
        convention_association.where(identifier_attribute => name).destroy_all
      end
    end

    convention_association.create!(
      identifier_attribute => name,
      content_attribute => content,
      **attrs
    )
  end

  def subdir
    raise NotImplementedError, 'CmsContentLoaders::Base subclasses must implement #subdir'
  end

  def identifier_attribute
    raise NotImplementedError,
      'CmsContentLoaders::Base subclasses must implement #identifier_attribute'
  end

  def content_attribute
    raise NotImplementedError,
      'CmsContentLoaders::Base subclasses must implement #content_attribute'
  end

  def convention_association
    raise NotImplementedError,
      'CmsContentLoaders::Base subclasses must implement #convention_associationd'
  end

  def taken_special_identifiers
    {}
  end

  def existing_content_identifiers
    @existing_content_identifiers ||= Set.new(convention_association.pluck(identifier_attribute))
  end

  def ensure_no_conflicting_content
    return unless conflict_policy == :error

    content_set.all_template_names(subdir).each do |name|
      if taken_special_identifiers[name]
        errors.add(:base, "#{convention.name} already has a #{taken_special_identifiers[name]}")
      end

      if existing_content_identifiers.include?(name)
        errors.add(:base, "A #{subdir.singularize} named #{name} already exists in \
#{convention.name}")
      end
    end
  end
end
