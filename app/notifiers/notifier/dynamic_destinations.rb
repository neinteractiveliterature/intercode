module Notifier::DynamicDestinations
  class Evaluator
    attr_reader :notifier

    def initialize(notifier:)
      @notifier = notifier
    end

    def user_con_profiles
      []
    end
  end

  class TriggeringUserEvaluator < Evaluator
    delegate :triggering_user, :convention, to: :notifier

    def user_con_profiles
      triggering_user.user_con_profiles.where(convention: convention)
    end
  end

  class EventTeamMembersEvaluator < Evaluator
    attr_reader :signup_state, :event

    def initialize(notifier:, signup_state:, event:)
      super(notifier:)
      @signup_state = signup_state
      @event = event
    end

    def user_con_profiles
      receive_signup_email_value =
        case signup_state
        when "waitlisted"
          %w[all_signups]
        else
          %w[all_signups non_waitlist_signups]
        end

      UserConProfile.where(
        id:
          TeamMember.where(receive_signup_email: receive_signup_email_value, event_id: event.id).select(
            :user_con_profile_id
          )
      )
    end
  end

  class SignupUserConProfileEvaluator < Evaluator
    attr_reader :signup

    def initialize(notifier:, signup:)
      super(notifier:)
      @signup = signup
    end

    def user_con_profiles
      [signup.user_con_profile]
    end
  end

  class SignupRequestUserConProfileEvaluator < Evaluator
    attr_reader :signup_request

    def initialize(notifier:, signup_request:)
      super(notifier:)
      @signup_request = signup_request
    end

    def user_con_profiles
      [signup_request.user_con_profile]
    end
  end

  class OrderUserConProfileEvaluator < Evaluator
    attr_reader :order

    def initialize(notifier:, order:)
      super(notifier:)
      @order = order
    end

    def user_con_profiles
      [order.user_con_profile]
    end
  end

  class TicketUserConProfileEvaluator < Evaluator
    attr_reader :ticket

    def initialize(notifier:, ticket:)
      super(notifier:)
      @ticket = ticket
    end

    def user_con_profiles
      [ticket.user_con_profile]
    end
  end

  class EventProposalOwnerEvaluator < Evaluator
    attr_reader :event_proposal

    def initialize(notifier:, event_proposal:)
      super(notifier:)
      @event_proposal = event_proposal
    end

    def user_con_profiles
      [event_proposal.owner]
    end
  end

  class UserActivityAlertDestinationsEvaluator < Evaluator
    attr_reader :user_activity_alert

    def initialize(notifier:, user_activity_alert:)
      super(notifier:)
      @user_activity_alert = user_activity_alert
    end

    def user_con_profiles
      user_activity_alert.notification_destinations.flat_map { |destination| destination.user_con_profiles(notifier) }
    end
  end
end
