class Types::PricingStructureValueType < Types::BaseUnion
  possible_types Types::MoneyType, Types::ScheduledMoneyValueType

  def self.resolve_type(object, _context)
    case object
    when Money then Types::MoneyType
    when ScheduledMoneyValue then Types::ScheduledMoneyValueType
    end
  end
end
