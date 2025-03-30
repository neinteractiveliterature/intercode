class Types::NotificationEventKey < Types::BaseEnum
  description <<~MARKDOWN
    An event that can trigger a notification.
  MARKDOWN

  Notifier::NOTIFIER_CLASSES_BY_EVENT_KEY.each_key { |event_key| value event_key.tr("/", "_").upcase, value: event_key }
end
