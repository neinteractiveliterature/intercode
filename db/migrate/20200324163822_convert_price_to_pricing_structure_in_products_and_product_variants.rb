class ConvertPriceToPricingStructureInProductsAndProductVariants < ActiveRecord::Migration[6.0]
  def change
    add_column :products, :pricing_structure, :jsonb
    add_column :product_variants, :override_pricing_structure, :jsonb

    reversible do |dir|
      dir.up do
        Product.includes(:product_variants).find_each do |product|
          convention_name = product.convention.name
          say "#{convention_name}: Converting fixed price to pricing structure for #{product.name}"
          product.update!(pricing_structure: PricingStructure.new(
            pricing_strategy: 'fixed',
            value: Money.new(product.price_cents, product.price_currency)
          ))

          product.product_variants.each do |variant|
            next unless variant.override_price_cents.present?
            say "#{convention_name}: Converting fixed price to pricing structure for \
#{product.name} variant #{variant.name}"
            variant.update!(override_pricing_structure: PricingStructure.new(
              pricing_strategy: 'fixed',
              value: Money.new(variant.override_price_cents, variant.override_price_currency)
            ))
          end
        end
      end

      dir.down do
        Product.includes(:product_variants).find_each do |product|
          convention_name = product.convention.name
          say "#{convention_name}: Converting pricing structure to fixed price for #{product.name}"
          price = product.pricing_structure.price
          product.update!(price_cents: price.fractional, price_currency: price.currency.iso_code)

          product.product_variants.each do |variant|
            next unless variant.override_pricing_structure
            say "#{convention_name}: Converting pricing structure to fixed price for \
#{product.name} variant #{variant.name}"
            override_price = variant.override_pricing_structure.price
            variant.update!(
              override_price_cents: override_price.fractional,
              override_price_currency: override_price.currency.iso_code
            )
          end
        end
      end
    end

    change_column_null :products, :pricing_structure, false

    remove_column :products, :price_cents, :integer
    remove_column :products, :price_currency, :string
    remove_column :product_variants, :override_price_cents, :integer
    remove_column :product_variants, :override_price_currency, :string
  end
end
