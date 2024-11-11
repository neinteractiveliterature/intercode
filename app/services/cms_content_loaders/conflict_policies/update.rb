class CmsContentLoaders::ConflictPolicies::Update < CmsContentLoaders::ConflictPolicy
  class SkippedItem
    attr_reader :existing_item, :new_item, :attrs, :reason
    delegate :identifier, to: :existing_item

    def initialize(existing_item:, new_item:, attrs:, reason:)
      @existing_item = existing_item
      @new_item = new_item
      @attrs = attrs
      @reason = reason
    end

    def message
      "skipped #{existing_item.model&.class&.name} #{identifier} because #{reason}"
    end
  end

  attr_reader :previous_content_by_identifier, :skipped_items

  def initialize(previous_content_by_identifier)
    @previous_content_by_identifier = previous_content_by_identifier
    @skipped_items = []
  end

  def all_previous_content_keys
    @all_previous_content_keys ||= Set.new(previous_content_by_identifier.flat_map(&:keys))
  end

  def previous_content_for(identifier)
    if previous_content_by_identifier.key?(identifier)
      previous_content_by_identifier[identifier]
    else
      all_previous_content_keys.index_with(nil)
    end
  end

  def action_for(existing_item, new_item, attrs)
    previous_content = previous_content_for(existing_item.identifier)

    modified_keys = []
    previous_content.each do |key, value|
      existing_value = existing_item.model&.public_send(key)

      if existing_value != value && existing_value != attrs[key]
        modified_keys << key
      end
    end

    if modified_keys.any?
      skipped_items << SkippedItem.new(
        existing_item:,
        new_item:,
        attrs:,
        reason: "#{modified_keys.to_sentence} #{modified_keys.size == 1 ? 'has' : 'have'} been modified"
      )
      :skip
    else
      :overwrite
    end
  end
end
