class Types::TicketPurchaseNavigationItemType < Types::BaseObject
  # There's really nothing to return here, but GraphQL requires we return something
  field :id, String, null: false

  def id
    'ticket_purchase'
  end
end
