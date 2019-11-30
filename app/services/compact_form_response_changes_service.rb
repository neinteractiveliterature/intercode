class CompactFormResponseChangesService < CivilService::Service
  attr_reader :scope, :send_mail

  def initialize(scope:)
    @scope = scope.not_compacted
  end

  private

  def inner_call
    convention_ids_with_pending_changes.each do |convention_id|
      all_pending_changes = scope.joins(:user_con_profile)
        .where(user_con_profiles: { convention_id: convention_id })
      response_ids = all_pending_changes.pluck(Arel.sql('distinct response_id'))

      response_ids.each do |response_id|
        compact_response_id(response_id)
      end
    end

    success
  end

  def convention_ids_with_pending_changes
    @convention_ids_with_pending_changes ||= scope.joins(:user_con_profile)
      .pluck(Arel.sql('distinct user_con_profiles.convention_id'))
  end

  def compact_response_id(response_id)
    ActiveRecord::Base.transaction do
      raw_changes = scope.includes(:user_con_profile).where(response_id: response_id)

      # skip compacting responses where changes are ongoing
      unless raw_changes.where('created_at >= ?', 1.hour.ago).any?
        compact_changes(response_id, raw_changes.to_a)
      end
    end
  end

  def compact_changes(response_id, raw_changes)
    compacted_changes = CompactingFormResponseChangesPresenter.new(raw_changes).compacted_changes
    compacted_changes.each do |change|
      created_at, updated_at = change.created_at, change.updated_at
      change.save!
      change.update_columns(created_at: created_at, updated_at: updated_at)
    end
    logger.debug "Response #{response_id}: compacted #{raw_changes.size} changes to \
#{compacted_changes.size}"
    FormResponseChange.where(id: raw_changes.map(&:id)).delete_all
  end
end
