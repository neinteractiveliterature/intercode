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

  def storage_adapter
    raise NotImplementedError, "CmsContentLoaders::Base subclasses must implement #storage_adapter"
  end

  def load_content(&block)
    storage_adapter.all_items_from_disk.each do |item|
      next if content_identifiers.present? && content_identifiers.exclude?(item.identifier)

      attrs = storage_adapter.read_item_attrs(item)
      model = load_item(item, attrs)
      next if model == :skip

      yield(model) if block
    end
  end

  def load_item(item, attrs)
    if existing_content_identifiers.include?(item.identifier)
      conflict_action = conflict_action_for(item, attrs)

      case conflict_action
      when :skip
        return :skip
      when :overwrite
        storage_adapter
          .cms_parent_association
          .where(storage_adapter.identifier_attribute => item.identifier)
          .destroy_all
      when :error
        ensure_no_conflict_for(item.identifier)
        raise ActiveModel::ValidationError, self
      end
    end

    create_item(item, attrs)
  end

  def conflict_action_for(item, attrs)
    case conflict_policy
    when CmsContentLoaders::ConflictPolicy
      conflict_policy.action_for(storage_adapter.item_from_database(item.identifier), item, attrs)
    else
      conflict_policy
    end
  end

  def create_item(item, attrs)
    storage_adapter.cms_parent_association.create!(storage_adapter.identifier_attribute => item.identifier, **attrs)
  end

  def taken_special_identifiers
    {}
  end

  def existing_content_identifiers
    @existing_content_identifiers ||=
      Set.new(storage_adapter.cms_parent_association.pluck(storage_adapter.identifier_attribute))
  end

  def ensure_no_conflicting_content
    return unless conflict_policy == :error

    storage_adapter.all_items_from_disk.map(&:identifier).each { |identifier| ensure_no_conflict_for(identifier) }
  end

  def ensure_no_conflict_for(identifier)
    return if content_identifiers.present? && content_identifiers.exclude?(identifier)

    if taken_special_identifiers[identifier]
      errors.add(:base, "#{cms_parent.name} already has a #{taken_special_identifiers[identifier]}")
    end

    return unless existing_content_identifiers.include?(identifier)
    errors.add(
      :base,
      "A #{storage_adapter.subdir.singularize} named #{identifier} already exists in #{cms_parent.name}"
    )
  end
end
