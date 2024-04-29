# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: signup_rounds
#
#  id                    :bigint           not null, primary key
#  maximum_event_signups :text             not null
#  start                 :datetime
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  convention_id         :bigint           not null
#
# Indexes
#
#  index_signup_rounds_on_convention_id  (convention_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class SignupRoundTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
