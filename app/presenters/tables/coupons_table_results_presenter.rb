class Tables::CouponsTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention:, pundit_user:, filters: {}, sort: nil, visible_field_ids: nil)
    scope = CouponPolicy::Scope.new(pundit_user, convention.coupons).resolve
    new(scope, filters, sort, visible_field_ids)
  end

  field :code, 'Code' do
    ilike_column_filter
  end

  field :fixed_amount, 'Fixed amount discount'
  field :percent_discount, 'Percent discount'
  field :provides_product, 'Provides product' do
    def generate_csv_cell(coupon)
      coupon.provides_product&.name
    end
  end

  field :usage_limit, 'Usage limit'
  field :expires_at, 'Expires at'
end
