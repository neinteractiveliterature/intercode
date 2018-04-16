class Types::TicketTypeType < Types::BaseObject

  field :id, Integer, null: false
  field :name, String, null: true
  field :publicly_available, Boolean, null: false
  field :counts_towards_convention_maximum, Boolean, null: false
  field :allows_event_signups, Boolean, null: false
  field :maximum_event_provided_tickets, Integer, null: false do
    argument :event_id, Integer, required: false
  end

  def maximum_event_provided_tickets(**args)
    if args[:event_id]
      @object.maximum_event_provided_tickets_for_event_id(args[:event_id])
    else
      @object.maximum_event_provided_tickets
    end
  end
  field :description, String, null: true
  field :pricing_schedule, Types::ScheduledMoneyValueType, null: true

  field :convention, Types::ConventionType, null: false

  def convention
    RecordLoader.for(Convention).load(@object.convention_id)
  end
end
