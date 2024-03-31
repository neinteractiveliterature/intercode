class AddAllowedCurrencyCodesToPayWhatYouWantPrices < ActiveRecord::Migration[7.1]
  def up
    execute <<~SQL
      UPDATE products
      SET pricing_structure = pricing_structure || jsonb_build_object(
        'value',
        pricing_structure->'value' || jsonb_build_object(
          'allowed_currency_codes',
          jsonb_build_array(coalesce(default_currency_code, #{connection.quote Money.default_currency.iso_code}))
        )
      )
      FROM conventions
      WHERE
        pricing_structure->>'pricing_strategy' = 'pay_what_you_want'
        AND products.convention_id = conventions.id
    SQL
  end

  def down
    execute <<~SQL
      UPDATE products
      SET pricing_structure = pricing_structure || jsonb_build_object('value', (pricing_structure->'value') - 'allowed_currency_codes')
      WHERE pricing_structure->>'pricing_strategy' = 'pay_what_you_want'
    SQL
  end
end
