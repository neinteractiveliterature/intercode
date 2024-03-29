# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: team_members
#
#  id                   :bigint           not null, primary key
#  display              :boolean
#  receive_con_email    :boolean
#  receive_signup_email :string           default("no"), not null
#  show_email           :boolean
#  created_at           :datetime
#  updated_at           :datetime
#  event_id             :bigint
#  updated_by_id        :bigint
#  user_con_profile_id  :bigint           not null
#
# Indexes
#
#  index_team_members_on_user_con_profile_id  (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
require 'test_helper'

class TeamMemberTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
