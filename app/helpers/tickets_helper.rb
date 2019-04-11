module TicketsHelper
  def ticket_purchase_form(ticket_type)
    ticket_types_data = convention.ticket_types.publicly_available.map do |available_ticket_type|
      {
        id: available_ticket_type.id,
        name: available_ticket_type.description,
        price: available_ticket_type.price.fractional,
        formattedPrice: available_ticket_type.price.format,
        nextPriceChange: available_ticket_type.next_price_change,
        formattedNextPrice: available_ticket_type.next_price&.format,
        available: true
      }
    end

    app_component 'TicketPurchaseForm',
      ticketPriceFormatted: ticket_type&.price&.format,
      initialTicketTypeId: ticket_type&.id,
      createChargeUrl: ticket_path,
      purchaseCompleteUrl: root_path,
      ticketTypes: ticket_types_data,
      initialName: user_con_profile.name_without_nickname
  end
end
