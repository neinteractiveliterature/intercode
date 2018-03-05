class Intercode::Import::Intercode1::Tables::StoreItems < Intercode::Import::Intercode1::Table
  attr_reader :con, :image_dir

  def initialize(connection, con, image_dir)
    super connection
    @con = con
    @image_dir = image_dir
  end

  private

  def build_record(row)
    File.open(File.expand_path("#{row[:ImageFilename]}", image_dir)) do |image|
      product = con.products.new(
        available: yn_to_bool(row[:Available]),
        name: product_name(row),
        description: "A #{product_name(row).downcase} with the #{con.name} logo.",
        image: image,
        price_cents: row[:PriceCents],
        price_currency: 'USD'
      )

      sizes(row).each do |size|
        product.product_variants.new(name: size)
      end

      product
    end
  end

  def row_id(row)
    row[:ItemId]
  end

  def product_name(row)
    [row[:Color], row[:Gender], row[:Style], row[:Singular]].select(&:present?).join(' ')
  end

  def sizes(row)
    return [] unless row[:Sizes].present?
    row[:Sizes].split(',')
  end
end
