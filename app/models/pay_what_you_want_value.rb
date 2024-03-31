# frozen_string_literal:true
class PayWhatYouWantValue
  include ActiveModel::Model

  validates :minimum_amount, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  validates :suggested_amount,
            numericality: {
              less_than_or_equal_to: ->(value) { value.maximum_amount || 999_999_99 },
              greater_than_or_equal_to: ->(value) { value.minimum_amount || 0 },
              allow_nil: true,
              message: "must be between minimum and maximum amount"
            }
  validates :maximum_amount,
            numericality: {
              greater_than_or_equal_to: ->(value) { value.minimum_amount || 0 },
              allow_nil: true,
              message: "must be greater than minimum amount"
            }

  attr_reader :minimum_amount, :maximum_amount, :suggested_amount
  attr_accessor :allowed_currency_codes

  %i[minimum_amount maximum_amount suggested_amount].each do |field|
    define_method :"#{field}=" do |value|
      instance_variable_set(:"@#{field}", MoneyCoder.load(value))
    end
  end

  def attributes
    %i[minimum_amount maximum_amount suggested_amount allowed_currency_codes].index_with do |attr_name|
      public_send(attr_name)
    end
  end

  def as_json
    attributes
  end

  def amount_errors(amount)
    errors = ActiveModel::Errors.new(amount)

    errors.add(:base, "Must be at least #{minimum_amount.format}") if amount < minimum_amount
    errors.add(:base, "Cannot be more than #{maximum_amount.format}") if amount > maximum_amount

    errors
  end

  def amount_valid?(amount)
    amount_errors(amount).empty?
  end
end
