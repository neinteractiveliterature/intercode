class CmsContentLoaders::Base < CivilService::Service
  validate :ensure_no_conflicting_content

  attr_reader :convention, :content_set

  def initialize(convention:, content_set:)
    @convention = convention
    @content_set = content_set
  end

  private

  def inner_call
    load_content
    success
  end

  def load_content(&block)
    content_set.all_template_paths_with_names(subdir).each do |path, name|
      content, attrs = content_set.template_content(path)
      model = convention_association.create!(
        identifier_attribute => name,
        content: content,
        **attrs
      )

      block.call(model) if block
    end
  end

  def subdir
    raise NotImplementedError, 'CmsContentLoaders::Base subclasses must implement #subdir'
  end

  def identifier_attribute
    raise NotImplementedError,
      'CmsContentLoaders::Base subclasses must implement #identifier_attribute'
  end

  def convention_association
    raise NotImplementedError,
      'CmsContentLoaders::Base subclasses must implement #convention_associationd'
  end

  def taken_special_identifiers
    {}
  end

  def ensure_no_conflicting_content
    content_identifiers = Set.new(convention_association.pluck(identifier_attribute))

    content_set.all_template_names(subdir).each do |name|
      if taken_special_identifiers[name]
        errors.add(:base, "#{convention.name} already has a #{taken_special_identifiers[name]}")
      end

      if content_identifiers.include?(name)
        errors.add(:base, "A #{subdir.singularize} named #{name} already exists in \
#{convention.name}")
      end
    end
  end
end
