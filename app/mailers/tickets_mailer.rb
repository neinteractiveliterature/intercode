class TicketsMailer < ApplicationMailer
  def purchased(ticket)
    notification_template_mail(
      ticket.convention,
      'tickets/purchased',
      { 'ticket' => ticket },
      from: from_address_for_convention(ticket.convention),
      to: ticket.user_con_profile.email,
    )
  end
end
