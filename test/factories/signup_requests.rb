# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: signup_requests
#
#  id                   :bigint           not null, primary key
#  requested_bucket_key :string
#  state                :string           default("pending"), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  replace_signup_id    :bigint
#  result_signup_id     :bigint
#  target_run_id        :bigint           not null
#  updated_by_id        :bigint
#  user_con_profile_id  :bigint           not null
#
# Indexes
#
#  index_signup_requests_on_replace_signup_id    (replace_signup_id)
#  index_signup_requests_on_result_signup_id     (result_signup_id)
#  index_signup_requests_on_state                (state)
#  index_signup_requests_on_target_run_id        (target_run_id)
#  index_signup_requests_on_updated_by_id        (updated_by_id)
#  index_signup_requests_on_user_con_profile_id  (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (replace_signup_id => signups.id)
#  fk_rails_...  (result_signup_id => signups.id)
#  fk_rails_...  (target_run_id => runs.id)
#  fk_rails_...  (updated_by_id => users.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
FactoryBot.define do
  factory :signup_request do
    target_run factory: :run
    state { "pending" }

    after(:build) do |signup_request|
      signup_request.user_con_profile ||=
        FactoryBot.create(:user_con_profile, convention: signup_request.target_run.event.convention)
      signup_request.updated_by ||= signup_request.user_con_profile.user
      signup_request.requested_bucket_key ||= (signup_request.target_run.event.registration_policy.buckets.first.key)
    end
  end
end
