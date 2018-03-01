class CompactingFormResponseChangesPresenter
  attr_reader :changes

  def initialize(changes)
    @changes = changes
  end

  def compacted_changes
    group_changes(changes).map do |grouped_changes|
      next if grouped_changes.first.previous_value == grouped_changes.last.new_value
      build_omnibus_change(grouped_changes)
    end.compact.sort_by(&:created_at)
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
      updated_at: raw_changes.last.updated_at
    )
  end

  def group_changes(raw_changes)
    changes_sorted_by_consecutive_user = raw_changes.sort_by(&:created_at)
      .slice_when { |c1, c2| c1.user_con_profile_id != c2.user_con_profile_id }
      .flat_map { |consecutive_user_changes| consecutive_user_changes.sort_by(&:field_identifier) }

    grouped_changes = changes_sorted_by_consecutive_user.slice_when do |c1, c2|
      [c1.user_con_profile_id, c1.field_identifier] != [c2.user_con_profile_id, c2.field_identifier]
    end

    grouped_changes.map { |change_group| change_group.sort_by(&:created_at) }
  end
end
