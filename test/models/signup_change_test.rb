# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: signup_changes
#
#  id                        :bigint           not null, primary key
#  action                    :string           not null
#  bucket_name               :string
#  counted                   :boolean
#  requested_bucket_name     :string
#  state                     :string           not null
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  bucket_id                 :bigint
#  previous_signup_change_id :bigint
#  requested_bucket_id       :bigint
#  run_id                    :bigint           not null
#  signup_id                 :bigint           not null
#  updated_by_id             :bigint
#  user_con_profile_id       :bigint           not null
#
# Indexes
#
#  index_signup_changes_on_bucket_id                  (bucket_id)
#  index_signup_changes_on_previous_signup_change_id  (previous_signup_change_id)
#  index_signup_changes_on_requested_bucket_id        (requested_bucket_id)
#  index_signup_changes_on_run_id                     (run_id)
#  index_signup_changes_on_signup_id                  (signup_id)
#  index_signup_changes_on_updated_by_id              (updated_by_id)
#  index_signup_changes_on_user_con_profile_id        (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (bucket_id => registration_policy_buckets.id) ON DELETE => nullify
#  fk_rails_...  (previous_signup_change_id => signup_changes.id)
#  fk_rails_...  (requested_bucket_id => registration_policy_buckets.id) ON DELETE => nullify
#  fk_rails_...  (run_id => runs.id)
#  fk_rails_...  (signup_id => signups.id)
#  fk_rails_...  (updated_by_id => users.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

require "test_helper"

class SignupChangeTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
