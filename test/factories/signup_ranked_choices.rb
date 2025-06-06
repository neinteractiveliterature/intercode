# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: signup_ranked_choices
#
#  id                       :bigint           not null, primary key
#  prioritize_waitlist      :boolean          default(FALSE), not null
#  priority                 :integer          not null
#  requested_bucket_key     :string
#  state                    :string           not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  result_signup_id         :bigint
#  result_signup_request_id :bigint
#  target_run_id            :bigint           not null
#  updated_by_id            :bigint           not null
#  user_con_profile_id      :bigint           not null
#
# Indexes
#
#  idx_on_user_con_profile_id_state_priority_7c693e2c51     (user_con_profile_id,state,priority) UNIQUE
#  index_signup_ranked_choices_on_result_signup_id          (result_signup_id)
#  index_signup_ranked_choices_on_result_signup_request_id  (result_signup_request_id)
#  index_signup_ranked_choices_on_target_run_id             (target_run_id)
#  index_signup_ranked_choices_on_updated_by_id             (updated_by_id)
#  index_signup_ranked_choices_on_user_con_profile_id       (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (result_signup_id => signups.id)
#  fk_rails_...  (result_signup_request_id => signup_requests.id) ON DELETE => nullify
#  fk_rails_...  (target_run_id => runs.id)
#  fk_rails_...  (updated_by_id => users.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

FactoryBot.define do
  factory :signup_ranked_choice do
    target_run factory: :run
    state { "pending" }

    after(:build) do |choice|
      choice.user_con_profile ||= FactoryBot.create(:user_con_profile, convention: choice.target_run.event.convention)
      choice.updated_by ||= choice.user_con_profile.user
      choice.requested_bucket_key ||= choice.target_run.event.registration_policy.buckets.first.key
    end
  end
end
