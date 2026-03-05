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

require "test_helper"

class SignupRankedChoiceTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:user_con_profile) { create(:user_con_profile, convention: convention) }
  let(:event) { create(:event, convention: convention) }
  let(:event_run) { create(:run, event: event) }
  let(:signup_ranked_choice) do
    create(:signup_ranked_choice, user_con_profile: user_con_profile, target_run: event_run, state: "pending")
  end

  it "is convertible to a Liquid drop" do
    drop = signup_ranked_choice.to_liquid
    assert_instance_of SignupRankedChoiceDrop, drop
  end

  describe "cross-convention validation" do
    let(:other_convention) { create(:convention) }
    let(:other_event) { create(:event, convention: other_convention) }
    let(:other_run) { create(:run, event: other_event) }

    it "is invalid when target_run belongs to a different convention" do
      choice = build(:signup_ranked_choice, user_con_profile: user_con_profile, target_run: other_run, state: "pending")
      assert_not choice.valid?
      assert choice.errors[:target_run].any?
    end
  end
end
