class NotifyFormResponseChangesService < ApplicationService
  attr_reader :scope, :send_mail

  def initialize(scope:, send_mail:)
    @scope = scope.not_notified
    @send_mail = send_mail
  end

  private

  def inner_call
    convention_ids_with_pending_changes = scope.joins(:user_con_profile)
      .pluck('distinct user_con_profiles.convention_id')

    convention_ids_with_pending_changes.each do |convention_id|
      all_pending_changes = scope.joins(:user_con_profile)
        .where(user_con_profiles: { convention_id: convention_id })
      response_ids = all_pending_changes.pluck('distinct response_id')

      response_ids.each do |response_id|
        ActiveRecord::Base.transaction do
          raw_changes = scope.includes(:user_con_profile).where(response_id: response_id).to_a
          notify_changes(response_id, raw_changes)
        end
      end
    end

    success
  end

  def notify_changes(response_id, raw_changes)
    compacted_changes = CompactingFormResponseChangesPresenter.new(raw_changes).compacted_changes
    send_mail.call(response_id, compacted_changes)
    FormResponseChange.where(id: raw_changes.map(&:id)).update_all(notified_at: Time.now)
  end
end
