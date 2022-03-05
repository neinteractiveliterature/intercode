# frozen_string_literal: true
class Types::PricingStructureValueType < Types::BaseUnion
  possible_types Types::MoneyType, Types::ScheduledMoneyValueType, Types::PayWhatYouWantValueType

  def self.resolve_type(object, _context)
    case object
    when Money
      Types::MoneyType
    when ScheduledMoneyValue
      Types::ScheduledMoneyValueType
    when PayWhatYouWantValue
      Types::PayWhatYouWantValueType
    end
  end
end
