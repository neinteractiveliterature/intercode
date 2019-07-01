FactoryBot.define do
  factory :form do
    association :convention
  end

  factory :event_proposal_form, parent: :form do
  end
end
