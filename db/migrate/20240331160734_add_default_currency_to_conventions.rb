class AddDefaultCurrencyToConventions < ActiveRecord::Migration[7.1]
  def change
    add_column :conventions, :default_currency, :string
    Convention.update_all(default_currency: Money.default_currency)
    change_column_null :conventions, :default_currency, false
  end
end
