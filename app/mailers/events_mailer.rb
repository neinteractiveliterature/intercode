class EventsMailer < ApplicationMailer
  def event_updated(event, changes)
    notification_mail(Events::EventUpdatedNotifier.new(event: event, changes: changes))
  end
end
