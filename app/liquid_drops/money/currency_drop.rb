# A currency used for money
class CurrencyDrop < Liquid::Drop
  # @api
  attr_reader :currency

  def initialize(currency)
    @currency = currency
  end

  delegate :iso_code, :iso_numeric, :name, :subunit, :symbol, :disambiguate_symbol,
    :thousands_separator, :decimal_mark, :symbol_first, to: :currency
end
