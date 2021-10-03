# frozen_string_literal: true
class CompactingFormResponseChangesPresenter
  attr_reader :changes

  def initialize(changes)
    @changes = changes
  end

  def compacted_changes
    group_changes(changes)
      .filter_map do |grouped_changes|
        next if grouped_changes.first.previous_value == grouped_changes.last.new_value
        build_omnibus_change(grouped_changes)
      end
      .sort_by(&:created_at)
  end

  private

  def build_omnibus_change(raw_changes)
    FormResponseChange.new(
      response_type: raw_changes.first.response_type,
      response_id: raw_changes.first.response_id,
      user_con_profile: raw_changes.first.user_con_profile,
      field_identifier: raw_changes.first.field_identifier,
      previous_value: raw_changes.first.previous_value,
      new_value: raw_changes.last.new_value,
      created_at: raw_changes.first.created_at,
      updated_at: raw_changes.last.updated_at,
      notified_at: raw_changes.filter_map(&:notified_at).max,
      compacted: true
    )
  end

  def group_changes(raw_changes)
    changes_by_group_identifier = raw_changes.group_by { |change| group_identifier(change) }

    changes_by_group_identifier.values.flat_map do |change_group|
      change_group.sort_by(&:created_at).slice_when { |c1, c2| c2.created_at - c1.created_at >= 1.hour }.to_a
    end
  end

  def group_identifier(change)
    [change.user_con_profile_id, change.field_identifier, change.notified_at.nil?]
  end
end
