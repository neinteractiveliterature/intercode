# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: coupon_applications
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  coupon_id  :bigint           not null
#  order_id   :bigint           not null
#
# Indexes
#
#  index_coupon_applications_on_coupon_id  (coupon_id)
#  index_coupon_applications_on_order_id   (order_id)
#
# Foreign Keys
#
#  fk_rails_...  (coupon_id => coupons.id)
#  fk_rails_...  (order_id => orders.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class CouponApplicationTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
