# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: forms
#
#  id            :bigint           not null, primary key
#  form_type     :string           not null
#  title         :text
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  convention_id :bigint
#
# Indexes
#
#  index_forms_on_convention_id  (convention_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

FactoryBot.define do
  factory :form do
    association :convention
  end

  factory :event_form, parent: :form do
    form_type { "event" }
  end

  factory :event_proposal_form, parent: :form do
    form_type { "event_proposal" }
  end

  factory :user_con_profile_form, parent: :form do
    form_type { "user_con_profile" }
  end
end
