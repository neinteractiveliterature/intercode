# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: organizations
#
#  id         :bigint           not null, primary key
#  name       :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# rubocop:enable Metrics/LineLength, Lint/RedundantCopDisableDirective
require 'test_helper'

class OrganizationTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
