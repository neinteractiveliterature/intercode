# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :user_con_profile do

    convention
    user

  end

  trait :staff  do
    staff true
  end

  trait :registration do
    registration true
  end

  trait :gm_liasion do
    gm_liasion true
  end

  trait :outreach do
    outreach true
  end

  trait :bid_committee do
    bid_committee true
  end

  trait :bid_chair do
    bid_chair true
  end

  trait :scheduling do
    scheduling true
  end

  trait :con_chair do
    con_chair true
  end

end