class Intercode::Import::Intercode1::RegistrationStatuses
  attr_reader :con, :paid_ticket_type

  def initialize(con, paid_ticket_type)
    @con = con
    @paid_ticket_type = paid_ticket_type
  end

  def import!
    registration_status_map.each do |status, ticket_type|
      ticket_type.save!
      Intercode::Import::Intercode1.logger.info("Imported #{status} ticket type as ID #{ticket_type.id}")
    end
  end

  # rubocop:disable Metrics/MethodLength
  def registration_status_map
    @registration_status_map ||=
      {
        'Paid' => paid_ticket_type,
        'Comp' =>
          con.ticket_types.new(
            name: 'event_comp',
            description: 'Comp badge for event',
            pricing_schedule: ScheduledMoneyValue.always(Money.new(0, 'USD')),
            publicly_available: false,
            maximum_event_provided_tickets: 2
          ),
        'Marketing' =>
          con.ticket_types.new(
            name: 'marketing_comp',
            description: 'Marketing comp badge',
            pricing_schedule: ScheduledMoneyValue.always(Money.new(0, 'USD')),
            publicly_available: false
          ),
        'Vendor' =>
          con.ticket_types.new(
            name: 'vendor',
            description: 'Vendor badge',
            pricing_schedule: ScheduledMoneyValue.always(Money.new(2000, 'USD')),
            publicly_available: false,
            counts_towards_convention_maximum: false,
            allows_event_signups: false
          ),
        'Rollover' =>
          con.ticket_types.new(
            name: 'rollover',
            description: 'Rollover badge from previous year',
            pricing_schedule: ScheduledMoneyValue.always(Money.new(0, 'USD')),
            publicly_available: false
          )
      }
  end
  # rubocop:enable Metrics/MethodLength
end
