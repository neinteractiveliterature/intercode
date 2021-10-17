# frozen_string_literal: true
class Types::PricingStructureValueType < Types::BaseUnion
  possible_types Types::MoneyType, Types::ScheduledMoneyValueType

  def self.resolve_type(object, _context)
    case object
    when Money
      Types::MoneyType
    when ScheduledMoneyValue
      Types::ScheduledMoneyValueType
    end
  end
end
