# frozen_string_literal:true
class PayWhatYouWantValue
  include ActiveModel::Model

  attr_reader :minimum_amount, :maximum_amount, :suggested_amount

  %i[minimum_amount maximum_amount suggested_amount].each do |field|
    define_method :"#{field}=" do |value|
      instance_variable_set(field, MoneyCoder.load(value))
    end
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
