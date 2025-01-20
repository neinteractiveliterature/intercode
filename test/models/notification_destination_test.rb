# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: notification_destinations
#
#  id                  :bigint           not null, primary key
#  source_type         :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  source_id           :bigint           not null
#  staff_position_id   :bigint
#  user_con_profile_id :bigint
#
# Indexes
#
#  index_notification_destinations_on_source_type_and_source_id  (source_type,source_id)
#  index_notification_destinations_on_staff_position_id          (staff_position_id)
#  index_notification_destinations_on_user_con_profile_id        (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (staff_position_id => staff_positions.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

require "test_helper"

class NotificationDestinationTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
