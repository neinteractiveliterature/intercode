FactoryGirl.define do
  factory :form do
  end

  factory :event_proposal_form, parent: :form do
    convention
  end
end
