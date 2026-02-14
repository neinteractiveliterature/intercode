require "test_helper"

class RemindQueueWithoutTicketTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper
  let(:convention) do
    create(
      :convention,
      ticket_mode: "required_for_signup",
      signup_automation_mode: "ranked_choice",
      starts_at: 2.weeks.from_now
    )
  end
  let(:user_con_profile) { create(:user_con_profile, convention: convention) }
  let(:event) { create(:event, convention: convention) }
  let(:event_run) { create(:run, event: event) }
  let(:signup_round) do
    create(
      :signup_round,
      convention: convention,
      automation_action: "execute_ranked_choice",
      ranked_choice_order: "asc",
      start: 1.week.from_now
    )
  end

  before do
    # Load CMS content including notification templates
    ClearCmsContentService.new(convention: convention).call!
    LoadCmsContentSetService.new(convention: convention, content_set_name: "standard").call!
    # Ensure signup round exists
    signup_round
  end

  describe "when user has queue items but no ticket" do
    before do
      create(:signup_ranked_choice, user_con_profile: user_con_profile, target_run: event_run, state: "pending")
    end

    it "sends a reminder" do
      assert_difference "ActionMailer::Base.deliveries.size", 1 do
        perform_enqueued_jobs { RemindQueueWithoutTicket.new.call! }
      end
    end

    it "updates queue_no_ticket_reminded_at timestamp" do
      RemindQueueWithoutTicket.new.call!
      user_con_profile.reload
      assert_not_nil user_con_profile.queue_no_ticket_reminded_at
    end
  end

  describe "when user has a ticket" do
    before do
      ticket_type = create(:free_ticket_type, convention: convention)
      create(:ticket, user_con_profile: user_con_profile, ticket_type: ticket_type)
      create(:signup_ranked_choice, user_con_profile: user_con_profile, target_run: event_run, state: "pending")
    end

    it "does not send a reminder" do
      assert_no_difference "ActionMailer::Base.deliveries.size" do
        RemindQueueWithoutTicket.new.call!
      end
    end
  end

  describe "when user has no queue items" do
    it "does not send a reminder" do
      assert_no_difference "ActionMailer::Base.deliveries.size" do
        RemindQueueWithoutTicket.new.call!
      end
    end
  end

  describe "when user was recently reminded" do
    before do
      user_con_profile.update!(queue_no_ticket_reminded_at: 3.days.ago)
      create(:signup_ranked_choice, user_con_profile: user_con_profile, target_run: event_run, state: "pending")
    end

    it "does not send a duplicate reminder" do
      assert_no_difference "ActionMailer::Base.deliveries.size" do
        RemindQueueWithoutTicket.new.call!
      end
    end
  end

  describe "when user was already reminded" do
    before do
      user_con_profile.update!(queue_no_ticket_reminded_at: 8.days.ago)
      create(:signup_ranked_choice, user_con_profile: user_con_profile, target_run: event_run, state: "pending")
    end

    it "does not send another reminder" do
      assert_no_difference "ActionMailer::Base.deliveries.size" do
        RemindQueueWithoutTicket.new.call!
      end
    end
  end

  describe "when convention is badgeless" do
    let(:badgeless_convention) { create(:convention, ticket_mode: "disabled", starts_at: 1.week.from_now) }
    let(:badgeless_user) { create(:user_con_profile, convention: badgeless_convention) }
    let(:badgeless_event) { create(:event, convention: badgeless_convention) }
    let(:badgeless_run) { create(:run, event: badgeless_event) }

    before do
      create(:signup_ranked_choice, user_con_profile: badgeless_user, target_run: badgeless_run, state: "pending")
    end

    it "does not send a reminder" do
      assert_no_difference "ActionMailer::Base.deliveries.size" do
        RemindQueueWithoutTicket.new.call!
      end
    end
  end

  describe "when convention has already started" do
    let(:started_convention) { create(:convention, ticket_mode: "required_for_signup", starts_at: 1.day.ago) }
    let(:started_user) { create(:user_con_profile, convention: started_convention) }
    let(:started_event) { create(:event, convention: started_convention) }
    let(:started_run) { create(:run, event: started_event) }

    before { create(:signup_ranked_choice, user_con_profile: started_user, target_run: started_run, state: "pending") }

    it "does not send a reminder" do
      assert_no_difference "ActionMailer::Base.deliveries.size" do
        RemindQueueWithoutTicket.new.call!
      end
    end
  end

  describe "when queue items are waitlisted" do
    before do
      signup = create(:signup, user_con_profile: user_con_profile, run: event_run, state: "waitlisted")
      create(
        :signup_ranked_choice,
        user_con_profile: user_con_profile,
        target_run: event_run,
        state: "waitlisted",
        result_signup: signup
      )
    end

    it "does not send a reminder" do
      assert_no_difference "ActionMailer::Base.deliveries.size" do
        RemindQueueWithoutTicket.new.call!
      end
    end
  end

  describe "when signup round is not one week away" do
    let(:far_signup_round) do
      create(
        :signup_round,
        convention: convention,
        automation_action: "execute_ranked_choice",
        ranked_choice_order: "asc",
        start: 2.weeks.from_now
      )
    end

    before do
      # Override the default signup round with one that's 2 weeks away
      SignupRound.where(id: signup_round.id).delete_all
      far_signup_round
      create(:signup_ranked_choice, user_con_profile: user_con_profile, target_run: event_run, state: "pending")
    end

    it "does not send a reminder" do
      assert_no_difference "ActionMailer::Base.deliveries.size" do
        RemindQueueWithoutTicket.new.call!
      end
    end
  end
end
