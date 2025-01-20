# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: ranked_choice_user_constraints
#
#  id                  :bigint           not null, primary key
#  finish              :datetime
#  maximum_signups     :integer          not null
#  start               :datetime
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  user_con_profile_id :bigint           not null
#
# Indexes
#
#  index_ranked_choice_user_constraints_on_user_con_profile_id  (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

FactoryBot.define do
  factory :ranked_choice_user_constraint do
    user_con_profile
    maximum_signups { 1 }
  end
end
