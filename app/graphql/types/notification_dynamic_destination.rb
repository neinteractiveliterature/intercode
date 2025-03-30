class Types::NotificationDynamicDestination < Types::BaseEnum
  description <<~MARKDOWN
    A dynamic destination for notifications.  Dynamic destinations are evaluated at runtime to determine
    the actual destination for a notification.
  MARKDOWN

  Notifier::Dsl::DYNAMIC_DESTINATION_EVALUATORS.each_key do |dynamic_destination|
    value dynamic_destination.to_s.upcase, value: dynamic_destination
  end
end
