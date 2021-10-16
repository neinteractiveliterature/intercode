# frozen_string_literal: true
module DeprecatedTicketApiCompat
  def ticket_type_publicly_available?(ticket_type)
    ticket_type.providing_products.any?(&:available)
  end

  def pricing_schedule_for_ticket_type(ticket_type)
    pricing_structure = ticket_type.providing_products.select(&:available).map(&:pricing_structure).first
    return ScheduledMoneyValue.new(timespans: []) unless pricing_structure

    coerce_pricing_structure_to_scheduled_value(pricing_structure)
  end

  def coerce_pricing_structure_to_scheduled_value(pricing_structure)
    case pricing_structure.pricing_strategy
    when 'fixed'
      ScheduledMoneyValue.always(pricing_structure.value)
    when 'scheduled_value'
      pricing_structure.value
    end
  end
end
