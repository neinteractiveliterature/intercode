# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: team_members
#
#  id                   :integer          not null, primary key
#  display              :boolean
#  receive_con_email    :boolean
#  receive_signup_email :string           default("no"), not null
#  show_email           :boolean
#  created_at           :datetime
#  updated_at           :datetime
#  event_id             :bigint
#  updated_by_id        :integer
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
FactoryBot.define do
  factory :team_member do
    event
    display { true }

    after(:build) do |team_member|
      team_member.user_con_profile ||= build(:user_con_profile, convention: team_member.event.convention)
    end
  end
end
