# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: signups
#
#  id                   :bigint           not null, primary key
#  bucket_key           :string
#  counted              :boolean
#  expires_at           :datetime
#  requested_bucket_key :string
#  state                :string           default("confirmed"), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  run_id               :bigint
#  updated_by_id        :bigint
#  user_con_profile_id  :bigint           not null
#
# Indexes
#
#  index_signups_on_expires_at           (expires_at)
#  index_signups_on_run_id               (run_id)
#  index_signups_on_updated_by_id        (updated_by_id)
#  index_signups_on_user_con_profile_id  (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (run_id => runs.id)
#  fk_rails_...  (updated_by_id => users.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
FactoryBot.define do
  factory :signup do
    state { 'confirmed' }
    counted { true }
    updated_by { nil }

    before(:create) do |signup|
      convention = signup.user_con_profile&.convention || signup.run&.event&.convention || create(:convention)
      event = signup.run&.event || create(:event, convention: convention)
      signup.user_con_profile ||= create(:user_con_profile, convention: convention)
      signup.run ||= create(:run, event: event)
      signup.bucket_key ||= signup.run.event.registration_policy.buckets.first.key if signup.confirmed?
    end
  end
end
