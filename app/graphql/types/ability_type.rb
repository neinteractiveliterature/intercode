class Types::AbilityType < Types::BaseObject

  field :can_override_maximum_event_provided_tickets, Boolean, null: false

  def can_override_maximum_event_provided_tickets
    override = TicketType.new(convention: @context[:convention])
      .maximum_event_provided_tickets_overrides
      .new
    @object.can?(:create, override)
  end

  field :can_update_event, Boolean, null: false do
    argument :event_id, Integer, required: true
  end

  def can_update_event(**args)
    ModelPermissionLoader.for(Event).load([@object, :update, args[:event_id]])
  end

  field :can_delete_event, Boolean, null: false do
    argument :event_id, Integer, required: true
  end

  def can_delete_event(**args)
    ModelPermissionLoader.for(Event).load([@object, :delete, args[:event_id]])
  end
end
