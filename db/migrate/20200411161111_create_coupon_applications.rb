class CreateCouponApplications < ActiveRecord::Migration[6.0]
  def change
    create_table :coupon_applications do |t|
      t.references :coupon, null: false, foreign_key: true
      t.references :order, null: false, foreign_key: true

      t.timestamps
    end
  end
end
