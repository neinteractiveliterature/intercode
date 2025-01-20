# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: departments
#
#  id                   :bigint           not null, primary key
#  name                 :text
#  proposal_description :text
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  convention_id        :bigint           not null
#
# Indexes
#
#  index_departments_on_convention_id  (convention_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

require "test_helper"

class DepartmentTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
