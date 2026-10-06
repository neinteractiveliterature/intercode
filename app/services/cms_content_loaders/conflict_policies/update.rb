# frozen_string_literal: true
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
    super()
    @previous_content_by_identifier = previous_content_by_identifier
    @skipped_items = []
  end

  def all_previous_content_keys
    @all_previous_content_keys ||=
      Set.new(previous_content_by_identifier.values.flat_map { |content| content.keys.map(&:to_s) })
  end

  def previous_content_for(identifier)
    if previous_content_by_identifier.key?(identifier)
      previous_content_by_identifier[identifier]
    else
      all_previous_content_keys.index_with(nil)
    end
  end

  def action_for(existing_item, new_item, attrs)
    # nothing in the database to conflict with
    return :overwrite unless existing_item.model

    previous_content = previous_content_for(existing_item.identifier)

    modified_keys = []
    previous_content.stringify_keys.each do |key, previous_value|
      existing_value = strip_if_string(existing_item.model.public_send(key))
      new_value = strip_if_string(attrs.stringify_keys[key])

      modified_keys << key if existing_value != strip_if_string(previous_value) && existing_value != new_value
    end

    if modified_keys.any?
      skipped_items << SkippedItem.new(
        existing_item:,
        new_item:,
        attrs:,
        reason: "#{modified_keys.to_sentence} #{modified_keys.size == 1 ? "has" : "have"} been modified"
      )
      :skip
    else
      :overwrite
    end
  end

  private

  # (attributes aren't all text; booleans and so on have no whitespace to ignore)
  def strip_if_string(value)
    value.is_a?(String) ? value.strip : value
  end
end
