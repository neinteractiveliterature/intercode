class MakeCouponCodesCaseInsensitiveUnique < ActiveRecord::Migration[6.0]
  def up
    execute <<~SQL
      CREATE UNIQUE INDEX coupon_codes_unique_per_convention_idx
      ON coupons(convention_id, LOWER(code))
    SQL
  end

  def down
    execute 'DROP INDEX coupon_codes_unique_per_convention_idx'
  end
end
