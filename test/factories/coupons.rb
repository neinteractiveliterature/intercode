FactoryBot.define do
  factory :coupon do
    convention
    fixed_amount { Money.new(1000, 'USD') }
  end
end
