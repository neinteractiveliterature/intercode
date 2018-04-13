class AddPositionToProductVariants < ActiveRecord::Migration[5.1]
  def change
    add_column :product_variants, :position, :integer
  end
end
