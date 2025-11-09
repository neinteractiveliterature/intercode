# frozen_string_literal: true
class SendNotificationJob < ApplicationJob
  def perform(event_key:, options:)
    notifier_class = Notifier.notifier_class_for_event_key(event_key)
    notifier = notifier_class.new(**options)
    notifier.deliver_now
  end
end
