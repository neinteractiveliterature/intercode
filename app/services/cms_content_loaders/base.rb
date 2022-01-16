# frozen_string_literal: true
class CmsContentLoaders::Base < CivilService::Service
  validate :ensure_no_conflicting_content

  attr_reader :cms_parent, :content_set, :content_identifiers, :conflict_policy

  def initialize(cms_parent:, content_set:, content_identifiers: nil, conflict_policy: :error)
    @cms_parent = cms_parent
    @content_set = content_set
    @conflict_policy = conflict_policy
    @content_identifiers = content_identifiers
  end

  private

  def inner_call
    load_content
    success
  end

  def persister
    raise NotImplementedError, 'CmsContentLoaders::Base subclasses must implement #persister'
  end

  def load_content(&block)
    persister.all_items.each do |item|
      next if content_identifiers.present? && content_identifiers.exclude?(item.identifier)

      attrs = persister.read_item_attrs(item)
      model = load_item(item, attrs)
      next if model == :skip

      yield(model) if block
    end
  end

  def load_item(item, attrs)
    if existing_content_identifiers.include?(item.identifier)
      return :skip if conflict_policy == :skip

      cms_parent_association.where(identifier_attribute => item.identifier).destroy_all if conflict_policy == :overwrite
    end

    create_item(item, attrs)
  end

  def create_item(item, attrs)
    persister.cms_parent_association.create!(persister.identifier_attribute => item.identifier, **attrs)
  end

  def taken_special_identifiers
    {}
  end

  def existing_content_identifiers
    @existing_content_identifiers ||= Set.new(persister.cms_parent_association.pluck(persister.identifier_attribute))
  end

  def ensure_no_conflicting_content
    return unless conflict_policy == :error

    persister
      .all_items
      .map(&:identifier)
      .each do |identifier|
        if taken_special_identifiers[identifier]
          errors.add(:base, "#{cms_parent.name} already has a #{taken_special_identifiers[identifier]}")
        end

        next unless existing_content_identifiers.include?(identifier)
        errors.add(:base, "A #{persister.subdir.singularize} named #{identifier} already exists in #{cms_parent.name}")
      end
  end
end
