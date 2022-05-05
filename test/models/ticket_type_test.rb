# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: ticket_types
#
#  id                                :bigint           not null, primary key
#  allows_event_signups              :boolean          default(TRUE), not null
#  counts_towards_convention_maximum :boolean          default(TRUE), not null
#  description                       :text
#  maximum_event_provided_tickets    :integer          default(0), not null
#  name                              :text             not null
#  created_at                        :datetime         not null
#  updated_at                        :datetime         not null
#  convention_id                     :bigint
#  event_id                          :bigint
#
# Indexes
#
#  index_ticket_types_on_convention_id  (convention_id)
#  index_ticket_types_on_event_id       (event_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (event_id => events.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
require 'test_helper'

class TicketTypeTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
