FactoryBot.define do
  factory :form do
    association :convention
  end

  factory :event_proposal_form, parent: :form do
    form_type 'event_proposal'
  end
end
