class NotifyFormResponseChangesService < CivilService::Service
  attr_reader :scope, :send_mail

  def initialize(scope:, send_mail:)
    @scope = scope
    @send_mail = send_mail
  end

  private

  def inner_call
    CompactFormResponseChangesService.new(scope: scope).call!
    notify_compacted_pending_changes(scope.compacted.not_notified)
  end

  def notify_compacted_pending_changes(pending_scope)
    convention_ids_with_pending_changes = pending_scope.joins(:user_con_profile)
      .pluck(Arel.sql('distinct user_con_profiles.convention_id'))

    convention_ids_with_pending_changes.each do |convention_id|
      all_pending_changes = pending_scope.joins(:user_con_profile)
        .where(user_con_profiles: { convention_id: convention_id })
      response_ids = all_pending_changes.pluck(Arel.sql('distinct response_id'))

      response_ids.each do |response_id|
        ActiveRecord::Base.transaction do
          changes = pending_scope.includes(:user_con_profile).where(response_id: response_id).to_a
          notify_changes(response_id, changes)
        end
      end
    end

    success
  end

  def notify_changes(response_id, changes)
    send_mail.call(response_id, changes) if changes.any?
    FormResponseChange.where(id: changes.map(&:id)).update_all(notified_at: Time.now)
  end
end
