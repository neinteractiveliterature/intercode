# frozen_string_literal: true
# An amount of money
class MoneyDrop < Liquid::Drop
  # @api
  attr_reader :money

  def initialize(money)
    @money = money
  end

  delegate :format, :fractional, :currency, :symbol, :decimal_mark, to: :money

  # @api
  def to_number
    money.to_d
  end
end
