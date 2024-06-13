# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: product_variants
#
#  id                         :bigint           not null, primary key
#  description                :text
#  image                      :string
#  name                       :text
#  override_pricing_structure :jsonb
#  position                   :integer
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  product_id                 :bigint
#
# Indexes
#
#  index_product_variants_on_product_id  (product_id)
#
# Foreign Keys
#
#  fk_rails_...  (product_id => products.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class ProductVariantTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
