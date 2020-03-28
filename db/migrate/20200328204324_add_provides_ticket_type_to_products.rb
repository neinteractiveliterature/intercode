class AddProvidesTicketTypeToProducts < ActiveRecord::Migration[6.0]
  def change
    add_reference :products, :provides_ticket_type,
      null: true, foreign_key: { to_table: 'ticket_types' }

    reversible do |dir|
      dir.up { convert_ticket_types_to_products }
      dir.down { revert_product_conversion }
    end

    remove_column :ticket_types, :publicly_available, :boolean, null: false, default: true
    remove_column :ticket_types, :pricing_schedule, :jsonb
  end

  def convert_ticket_types_to_products
    Product.reset_column_information
    TicketType.reset_column_information

    TicketType.where(publicly_available: true).includes(:convention).find_each do |ticket_type|
      say_with_time(
        "Converting #{ticket_type.convention.name} #{ticket_type.description} to product"
      ) do
        pricing_schedule = ticket_type.pricing_schedule
        structure = if pricing_schedule.covers_all_time? && pricing_schedule.timespans.size == 1
          PricingStructure.new(
            pricing_strategy: 'fixed', value: pricing_schedule.value_at(Time.zone.now)
          )
        else
          PricingStructure.new(pricing_strategy: 'scheduled_value', value: pricing_schedule)
        end

        ticket_type.providing_products.create!(
          convention: ticket_type.convention,
          available: true,
          name: ticket_type.description,
          description: "#{ticket_type.description} for #{ticket_type.convention.name}",
          payment_options: ['stripe'],
          pricing_structure: structure
        )
      end
    end
  end

  def revert_product_conversion
    Product.reset_column_information
    TicketType.reset_column_information

    # the column is default true, but we need to set this as false at first and then set them as
    # true one by one
    TicketType.update_all(publicly_available: false)

    Product.ticket_providing.includes(:provides_ticket_type, :convention).find_each do |product|
      say_with_time "Converting #{product.convention.name} #{product.name} to ticket type fields" do
        pricing_schedule = case product.pricing_structure.pricing_strategy
        when 'fixed' then ScheduledMoneyValue.always(product.pricing_structure.value)
        else product.pricing_structure.value
        end

        product.provides_ticket_type.update!(
          publicly_available: true,
          pricing_schedule: pricing_schedule
        )

        product.destroy!
      end
    end
  end
end
