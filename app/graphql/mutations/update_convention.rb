# frozen_string_literal: true
class Mutations::UpdateConvention < Mutations::BaseMutation
  include ScheduledValueInputs

  field :convention, Types::ConventionType, null: false

  argument :id, ID, required: false
  argument :convention, Types::ConventionInputType, required: true

  define_authorization_check do |args|
    @convention = args[:id] ? Convention.find(args[:id]) : context[:convention]
    policy(@convention).update?
  end

  def resolve(**args)
    desired_signup_rounds = nil
    convention_data = args[:convention].to_h.merge(updated_by: current_user)

    if args[:convention].maximum_event_signups.present?
      maximum_event_signups_scheduled_value = process_scheduled_value_input(args[:convention].maximum_event_signups)
      desired_signup_rounds =
        maximum_event_signups_scheduled_value[:timespans].map do |timespan|
          { convention_id: @convention.id, start: timespan[:start], maximum_event_signups: timespan[:value] }
        end

      convention_data.delete(:maximum_event_signups)
    end

    Convention.transaction do
      @convention.update!(convention_data)
      if desired_signup_rounds.present?
        @convention.signup_rounds.destroy_all
        @convention.signup_rounds.insert_all(desired_signup_rounds)
      end
    end

    @convention.signup_rounds.reload

    { convention: @convention }
  end
end
