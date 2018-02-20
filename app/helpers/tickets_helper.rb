module TicketsHelper
  def stripe_include_tag
    publishable_key = Rails.configuration.stripe[:publishable_key]

    (
      javascript_include_tag('https://js.stripe.com/v2/') +
      content_tag('script', type: 'application/javascript') do
        "Stripe.setPublishableKey(#{publishable_key.to_json});".html_safe
      end
    )
  end

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

    react_component 'TicketPurchaseForm',
      ticketPriceFormatted: ticket_type&.price&.format,
      ticketTypeId: ticket_type&.id,
      createChargeUrl: ticket_path,
      purchaseCompleteUrl: root_path,
      ticketTypes: ticket_types_data,
      initialName: user_con_profile.name_without_nickname,
      authenticityToken: graphql_authenticity_token
  end
end
