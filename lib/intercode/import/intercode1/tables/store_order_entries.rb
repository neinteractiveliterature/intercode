class Intercode::Import::Intercode1::Tables::StoreOrderEntries < Intercode::Import::Intercode1::Table
  attr_reader :con, :order_id_map, :product_id_map

  def initialize(connection, order_id_map, product_id_map)
    super connection
    @order_id_map = order_id_map
    @product_id_map = product_id_map
  end

  def dataset
    super.where(Sequel.lit('Quantity > 0'))
  end

  private

  def build_record(row)
    product = product_id_map[row[:ItemId]]

    order_id_map[row[:OrderId]].order_entries.new(
      product: product,
      product_variant: product_variant(product, row[:Size]),
      quantity: row[:Quantity],
      price_per_item_cents: row[:PricePerItemCents],
      price_per_item_currency: 'USD'
    )
  end

  def row_id(row)
    row[:OrderEntryId]
  end

  def product_variant(product, size)
    product.product_variants.find_by!(name: size)
  end
end
