# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: email_routes
#
#  id                :bigint           not null, primary key
#  forward_addresses :text             not null, is an Array
#  receiver_address  :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_email_routes_on_receiver_address  (receiver_address) UNIQUE
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

require "test_helper"

class EmailRouteTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
