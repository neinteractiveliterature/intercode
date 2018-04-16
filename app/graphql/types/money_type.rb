class Types::MoneyType < Types::BaseObject

  field :fractional, Integer, null: false
  field :currency_code, String, null: false

  def currency_code
    @object.currency.iso_code
  end
end
