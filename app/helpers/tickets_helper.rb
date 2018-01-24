module TicketsHelper
  def stripe_include_tag
    javascript_include_tag("https://js.stripe.com/v2/") + content_tag('script', type: 'application/javascript') do
      "Stripe.setPublishableKey(#{Rails.configuration.stripe[:publishable_key].to_json});".html_safe
    end
  end

  def ticket_purchase_form(ticket)
    ticket_types_data = convention.ticket_types.publicly_available.map do |ticket_type|
      {
        id: ticket_type.id,
        name: ticket_type.description,
        price: ticket_type.price.fractional,
        formattedPrice: ticket_type.price.format,
        nextPriceChange: ticket_type.next_price_change,
        formattedNextPrice: ticket_type.next_price&.format,
        available: true
      }
    end

    react_component "TicketPurchaseForm", {
      ticketPriceFormatted: ticket&.ticket_type&.price&.format,
      ticketTypeId: ticket&.ticket_type&.id,
      createChargeUrl: ticket_path,
      purchaseCompleteUrl: root_path,
      ticketTypes: ticket_types_data
    }
  end
end
