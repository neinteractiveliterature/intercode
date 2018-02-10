class NotifyEventProposalChangesJob < ApplicationJob
  queue_as :default

  def perform
    scope = FormResponseChange.not_notified.where(response_type: 'EventProposal')

    convention_ids_with_pending_changes = scope.joins(:user_con_profile)
      .pluck('distinct user_con_profiles.convention_id')

    convention_ids_with_pending_changes.each do |convention_id|
      all_pending_changes = scope.joins(:user_con_profile)
        .where(user_con_profiles: { convention_id: convention_id })
      event_proposal_ids = all_pending_changes.pluck('distinct response_id')

      event_proposal_ids.each do |event_proposal_id|
        ActiveRecord::Base.transaction do
          raw_changes = scope.includes(:user_con_profile).where(response_id: event_proposal_id).to_a
          notify_changes(event_proposal_id, raw_changes)
        end
      end
    end
  end

  private

  def group_changes(raw_changes)
    changes_sorted_by_consecutive_user = raw_changes.sort_by(&:created_at)
      .slice_when { |c1, c2| c1.user_con_profile_id != c2.user_con_profile_id }
      .flat_map { |consecutive_user_changes| consecutive_user_changes.sort_by(&:field_identifier) }

    grouped_changes = changes_sorted_by_consecutive_user.slice_when do |c1, c2|
      [c1.user_con_profile_id, c1.field_identifier] != [c2.user_con_profile_id, c2.field_identifier]
    end

    grouped_changes.map { |change_group| change_group.sort_by(&:created_at) }
  end

  def build_omnibus_change(changes)
    FormResponseChange.new(
      response_type: changes.first.response_type,
      response_id: changes.first.response_id,
      user_con_profile: changes.first.user_con_profile,
      field_identifier: changes.first.field_identifier,
      previous_value: changes.first.previous_value,
      new_value: changes.last.new_value,
      created_at: changes.first.created_at,
      updated_at: changes.last.updated_at
    )
  end

  def compact_changes(raw_changes)
    group_changes(raw_changes).map do |changes|
      next if changes.first.previous_value == changes.last.new_value
      build_omnibus_change(changes)
    end.compact.sort_by(&:created_at)
  end

  def notify_changes(event_proposal_id, raw_changes)
    compacted_changes = compact_changes(raw_changes)
    event_proposal = EventProposal.find(event_proposal_id)

    EventProposalsMailer.proposal_updated(event_proposal, compacted_changes).deliver_now
    FormResponseChange.where(id: raw_changes.map(&:id)).update_all(notified_at: Time.now)
  end
end
