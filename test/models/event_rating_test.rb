# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: event_ratings
#
#  id                  :bigint           not null, primary key
#  rating              :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  event_id            :bigint           not null
#  user_con_profile_id :bigint           not null
#
# Indexes
#
#  index_event_ratings_on_event_id                          (event_id)
#  index_event_ratings_on_user_con_profile_id               (user_con_profile_id)
#  index_event_ratings_on_user_con_profile_id_and_event_id  (user_con_profile_id,event_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

require 'test_helper'

class EventRatingTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
