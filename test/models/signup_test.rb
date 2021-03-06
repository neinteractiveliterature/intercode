# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: signups
#
#  id                   :integer          not null, primary key
#  bucket_key           :string
#  counted              :boolean
#  requested_bucket_key :string
#  state                :string           default("confirmed"), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  run_id               :integer
#  updated_by_id        :integer
#  user_con_profile_id  :integer          not null
#
# Indexes
#
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
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
require 'test_helper'

class SignupTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
