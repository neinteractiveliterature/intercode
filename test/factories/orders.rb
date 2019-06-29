FactoryBot.define do
  factory :order do
    status { 'pending' }
    association :user_con_profile
  end
end
