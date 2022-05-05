# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: staff_positions
#
#  id            :bigint           not null, primary key
#  cc_addresses  :text             default([]), not null, is an Array
#  email         :text
#  email_aliases :text             default([]), not null, is an Array
#  name          :text
#  visible       :boolean
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  convention_id :bigint
#
# Indexes
#
#  index_staff_positions_on_convention_id  (convention_id)
#  index_staff_positions_on_visible        (visible)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
require 'test_helper'

class StaffPositionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
