class TicketsMailer < ApplicationMailer
  def purchased(ticket)
    notification_mail(Tickets::PurchasedNotifier.new(ticket: ticket))
  end
end
