class Tables::CouponsTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention:, pundit_user:, filters: {}, sort: nil, visible_field_ids: nil)
    scope = CouponPolicy::Scope.new(pundit_user, convention.coupons).resolve
    new(scope, filters, sort, visible_field_ids)
  end

  field :code, 'Code' do
    ilike_column_filter
  end

  field :created_at, 'Created at'
end
