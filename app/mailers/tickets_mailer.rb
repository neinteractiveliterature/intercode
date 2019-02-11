class TicketsMailer < ApplicationMailer
  def purchased(ticket)
    @ticket = ticket

    use_convention_timezone(ticket.convention) do
      mail(
        from: from_address_for_convention(ticket.convention),
        to: ticket.user_con_profile.email,
        subject: "#{subject_prefix(@ticket)} #{@ticket.ticket_type.description.titleize} \
Purchase Receipt"
      )
    end
  end

  private

  def subject_prefix(ticket)
    "[#{ticket.convention.name}]"
  end
end
