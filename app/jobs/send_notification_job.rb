# frozen_string_literal: true
class SendNotificationJob < ApplicationJob
  retry_on Aws::SES::Errors::Throttling, wait: :polynomially_longer, attempts: 10

  def perform(event_key:, options:)
    notifier_class = Notifier.notifier_class_for_event_key(event_key)
    notifier = notifier_class.new(**options)
    notifier.deliver_now
  end
end
