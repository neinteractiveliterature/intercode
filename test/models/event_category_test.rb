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
require "test_helper"

class EventCategoryTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
