# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: signup_rounds
#
#  id                    :bigint           not null, primary key
#  automation_action     :text
#  executed_at           :datetime
#  maximum_event_signups :text             not null
#  ranked_choice_order   :text
#  start                 :datetime
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  convention_id         :bigint           not null
#
# Indexes
#
#  index_signup_rounds_on_convention_id  (convention_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

require "test_helper"

class SignupRoundTest < ActiveSupport::TestCase
  describe "#execute!" do
    it "does nothing when automation_action is nil" do
      mock_service = Minitest::Mock.new
      signup_round = FactoryBot.create(:signup_round, automation_action: nil)

      ExecuteRankedChoiceSignupRoundService.stub :new, mock_service do
        signup_round.execute!
      end

      mock_service.verify
    end

    it "runs ranked choice signups when configured to do so" do
      mock_service = Minitest::Mock.new
      mock_service.expect :call!, nil
      convention = FactoryBot.create(:convention, signup_automation_mode: "ranked_choice")
      signup_round = FactoryBot.create(:signup_round, convention:, automation_action: "execute_ranked_choice")

      ExecuteRankedChoiceSignupRoundService.stub :new, mock_service do
        signup_round.execute!
      end

      mock_service.verify
    end

    it "does not run ranked choice signups when automation_action is nil, even if in a ranked-choice con" do
      mock_service = Minitest::Mock.new
      convention = FactoryBot.create(:convention, signup_automation_mode: "ranked_choice")
      signup_round = FactoryBot.create(:signup_round, convention:, automation_action: nil)

      ExecuteRankedChoiceSignupRoundService.stub :new, mock_service do
        signup_round.execute!
      end

      mock_service.verify
    end
  end
end
