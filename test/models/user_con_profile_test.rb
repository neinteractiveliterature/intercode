# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: user_con_profiles
#
#  id                           :bigint           not null, primary key
#  accepted_clickwrap_agreement :boolean          default(FALSE), not null
#  additional_info              :jsonb
#  address                      :text
#  allow_sms                    :boolean          default(TRUE), not null
#  best_call_time               :string
#  bio                          :text
#  birth_date                   :date
#  city                         :string
#  country                      :string
#  day_phone                    :string
#  evening_phone                :string
#  first_name                   :string           not null
#  gender                       :string
#  gravatar_enabled             :boolean          default(FALSE), not null
#  ical_secret                  :text             not null
#  last_name                    :string           not null
#  mobile_phone                 :string
#  needs_update                 :boolean          default(FALSE), not null
#  nickname                     :string
#  preferred_contact            :string
#  receive_whos_free_emails     :boolean          default(TRUE), not null
#  show_nickname_in_bio         :boolean
#  state                        :string
#  zipcode                      :string
#  created_at                   :datetime
#  updated_at                   :datetime
#  convention_id                :bigint           not null
#  user_id                      :bigint           not null
#
# Indexes
#
#  index_user_con_profiles_on_convention_id_and_user_id  (convention_id,user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (user_id => users.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
require 'test_helper'

class UserConProfileTest < ActiveSupport::TestCase
  describe 'is_team_member' do
    it 'finds a user who is a team member for an event' do
      team_member = create(:team_member)
      assert UserConProfile.is_team_member.to_a.include?(team_member.user_con_profile)
    end

    it "doesn't find a user who isn't a team member" do
      user_con_profile = create(:user_con_profile)
      refute UserConProfile.is_team_member.to_a.include?(user_con_profile)
    end

    it 'scopes correctly by convention' do
      team_member = create(:team_member)
      other_convention = create(:convention)

      assert team_member.event.convention.user_con_profiles.is_team_member.to_a.include?(team_member.user_con_profile)
      refute other_convention.user_con_profiles.is_team_member.to_a.include?(team_member.user_con_profile)
    end
  end
end
