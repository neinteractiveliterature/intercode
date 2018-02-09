class TicketsMailer < ApplicationMailer
  def purchased(ticket)
    @ticket = ticket

    mail(
      to: ticket.user_con_profile.email,
      subject: "#{subject_prefix(@ticket)} #{@ticket.ticket_type.description.titleize} \
Purchase Receipt"
    )
  end

  private

  def subject_prefix(ticket)
    "[#{ticket.convention.name}]"
  end
end
