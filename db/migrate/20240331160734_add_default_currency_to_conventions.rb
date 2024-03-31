class AddDefaultCurrencyToConventions < ActiveRecord::Migration[7.1]
  def change
    add_column :conventions, :default_currency_code, :string
  end
end
