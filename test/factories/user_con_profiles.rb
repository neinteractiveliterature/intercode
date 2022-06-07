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
FactoryBot.define do
  factory :user_con_profile do
    user
    convention

    first_name { |profile| profile.user.first_name }
    last_name { |profile| profile.user.last_name }
    nickname { 'Nick' }
  end
end
