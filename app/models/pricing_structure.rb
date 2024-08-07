# frozen_string_literal: true
class PricingStructure
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  PRICING_STRATEGIES = %w[fixed scheduled_value pay_what_you_want].freeze
  FIXED_VALUE_CODER = MoneyCoder
  SCHEDULED_VALUE_CODER = ActiveModelCoder.new("ScheduledMoneyValue")
  PAY_WHAT_YOU_WANT_CODER = ActiveModelCoder.new("PayWhatYouWantValue")

  attr_accessor :pricing_strategy
  attr_writer :value
  validates :pricing_strategy, presence: true, inclusion: { in: PRICING_STRATEGIES }
  validates :value, presence: true
  validate :ensure_value_type_is_correct
  validate :ensure_value_is_valid

  def value
    # Lazily deserialize value, because we might get a mass assignment with no intention to actually
    # read the value back
    @value = coder_for_strategy.load(@value) if @value.is_a?(Hash)
    @value
  end

  def attributes
    { pricing_strategy: pricing_strategy, value: coder_for_strategy.dump(value) }
  end

  def as_json(_options = nil)
    attributes
  end

  def price(time: nil)
    case value
    when Money
      value
    when ScheduledMoneyValue
      value.value_at(time || Time.zone.now)
    when PayWhatYouWantValue
      value.suggested_amount || value.minimum_amount || Money.new(0, Money.default_currency)
    else
      raise TypeError, "Can't get a price from #{value.inspect}"
    end
  end

  def to_liquid
    PricingStructureDrop.new(self, Time.zone)
  end

  private

  def coder_for_strategy
    case pricing_strategy
    when "fixed"
      FIXED_VALUE_CODER
    when "scheduled_value"
      SCHEDULED_VALUE_CODER
    when "pay_what_you_want"
      PAY_WHAT_YOU_WANT_CODER
    else
      raise "Invalid pricing strategy: #{pricing_strategy.inspect}"
    end
  end

  def ensure_value_type_is_correct
    return nil unless value # other validations will handle the nil case

    expected_class =
      case pricing_strategy
      when "fixed"
        Money
      when "scheduled_value"
        ScheduledMoneyValue
      when "pay_what_you_want"
        PayWhatYouWantValue
      else
        return # let the other validations handle this case
      end

    return if value.is_a?(expected_class)
    errors.add :value,
               "should be a #{expected_class.name} object (because pricing strategy is \
#{pricing_strategy.inspect}) but is a #{value.class.name} object instead"
  end

  def ensure_value_is_valid
    return nil unless value.is_a?(PayWhatYouWantValue)
    return if value.valid?

    value.errors.each { |error| errors.add(error.attribute, error.message) }
  end
end
