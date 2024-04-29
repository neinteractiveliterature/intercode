# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: event_categories
#
#  id                     :bigint           not null, primary key
#  can_provide_tickets    :boolean          default(FALSE), not null
#  default_color          :text             not null
#  full_color             :text             not null
#  name                   :text             not null
#  proposal_description   :text
#  scheduling_ui          :text             not null
#  signed_up_color        :text             not null
#  team_member_name       :text             not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  convention_id          :bigint           not null
#  department_id          :bigint
#  event_form_id          :bigint           not null
#  event_proposal_form_id :bigint
#
# Indexes
#
#  index_event_categories_on_convention_id           (convention_id)
#  index_event_categories_on_department_id           (department_id)
#  index_event_categories_on_event_form_id           (event_form_id)
#  index_event_categories_on_event_proposal_form_id  (event_proposal_form_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (department_id => departments.id)
#  fk_rails_...  (event_form_id => forms.id)
#  fk_rails_...  (event_proposal_form_id => forms.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
FactoryBot.define do
  factory :event_category do
    sequence(:name) { |n| "Event category #{n}" }
    team_member_name { "team member" }
    scheduling_ui { "regular" }
    default_color { "#d4f5fa" }
    full_color { "rgba(23, 162, 184, 0.7)" }
    signed_up_color { "#17a2b8" }
    convention

    after(:build) do |event_category|
      event_category.event_form ||=
        event_category.build_event_form(convention: event_category.convention, form_type: "event")
      event_category.event_proposal_form ||=
        event_category.build_event_proposal_form(convention: event_category.convention, form_type: "event_proposal")
    end
  end
end
