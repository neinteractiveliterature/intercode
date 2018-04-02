class Intercode::Import::Intercode1::LegacyTShirtImporter
  LEGACY_SHIRT_SIZES = %w[Small Medium Large XLarge XXLarge X3Large X4Large X5Large]

  attr_reader :connection, :con, :config, :user_con_profile_id_map

  def initialize(connection, con, config, user_con_profile_id_map)
    @connection = connection
    @con = con
    @config = config
    @user_con_profile_id_map = user_con_profile_id_map
  end

  def import!
    create_products

    connection[:TShirts].each do |row|
      logger.info "Importing TShirts for user #{row[:UserId]}"

      user_con_profile = user_con_profile_id_map[row[:UserId]]
      order = create_order(user_con_profile, row)
      create_order_entries(order, row)
    end
  end

  private

  def logger
    Intercode::Import::Intercode1.logger
  end

  def two_shirts?
    config.var(:shirt_two_shirts)
  end

  def create_products
    logger.info 'Creating shirt 1'
    @shirt1 = build_product_with_image_if_available(config.var(:shirt_name), 'shirt.gif')
    @shirt1.save!

    return unless two_shirts?
    logger.info 'Creating shirt 2'
    @shirt2 = build_product_with_image_if_available(config.var(:shirt2_name), 'shirt2.gif')
    @shirt2.save!
  end

  def build_product_with_image_if_available(name, image_filename)
    if config.var(:shirt_img_available)
      File.open(image_path(image_filename)) do |image|
        build_product_with_image(name, image)
      end
    else
      build_product_with_image(name, nil)
    end
  end

  def build_product_with_image(name, image)
    product = con.products.new(
      available: true,
      name: name,
      description: "A shirt with the #{con.name} logo.",
      image: image,
      price_cents: config.var(:tshirt_dollars) * 100,
      price_currency: 'USD'
    )

    LEGACY_SHIRT_SIZES.each do |size|
      product.product_variants.new(name: size)
    end

    product
  end

  def create_order(user_con_profile, row)
    user_con_profile.orders.create!(
      status: row[:Status].downcase,
      payment_amount_cents: row[:PaymentAmount],
      payment_amount_currency: 'USD',
      payment_note: row[:PaymentNote]
    )
  end

  def create_order_entry(order, product, variant_name, quantity)
    product_variant = product.product_variants.find { |variant| variant.name == variant_name }
    entry = order.order_entries.find_or_initialize_by(
      product_id: product.id,
      product_variant_id: product_variant.id
    ) { |new_entry| new_entry.quantity = 0 }

    entry.quantity += quantity
    entry.save!
  end

  def create_order_entries(order, row)
    LEGACY_SHIRT_SIZES.each do |size|
      create_order_entry(order, @shirt1, size, row[size.to_sym]) if row[size.to_sym].to_i > 0

      if two_shirts? && row[:"#{size}_2"].to_i > 0
        create_order_entry(order, @shirt1, size, row[:"#{size}_2"])
      end
    end
  end

  def image_path(filename)
    File.expand_path(filename, config.basedir)
  end
end
