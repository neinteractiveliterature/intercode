class AddPaymentOptionsToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :payment_options, :text

    reversible do |dir|
      dir.up do
        Product.update_all(payment_options: %w[stripe pay_at_convention])
      end
    end
  end
end
