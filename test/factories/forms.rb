FactoryBot.define do
  factory :form do
    association :convention
  end

  factory :event_form, parent: :form do
    form_type { 'event' }
  end

  factory :event_proposal_form, parent: :form do
    form_type { 'event_proposal' }
  end

  factory :user_con_profile_form, parent: :form do
    form_type { 'user_con_profile' }
  end
end
