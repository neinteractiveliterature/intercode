# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: orders
#
#  id                      :bigint           not null, primary key
#  paid_at                 :datetime
#  payment_amount_cents    :integer
#  payment_amount_currency :string
#  payment_note            :text
#  status                  :string           not null
#  submitted_at            :datetime
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  charge_id               :string
#  user_con_profile_id     :bigint           not null
#
# Indexes
#
#  index_orders_on_user_con_profile_id  (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

FactoryBot.define do
  factory :order do
    status { "pending" }
    association :user_con_profile
  end
end
