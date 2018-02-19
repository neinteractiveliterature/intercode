Types::QueryType = GraphQL::ObjectType.define do
  name 'Query'
  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  field :convention, Types::ConventionType do
    argument :id, types.Int

    resolve ->(_obj, args, ctx) {
      if args[:id]
        Convention.find(args[:id])
      else
        ctx[:convention]
      end
    }
  end

  field :event, Types::EventType do
    argument :id, !types.Int

    resolve ->(_obj, args, ctx) {
      ctx[:convention].events.active.find(args[:id])
    }
  end

  field :events, types[Types::EventType] do
    argument :extendedCounts, types.Boolean
    argument :includeDropped, types.Boolean

    guard ->(_obj, args, ctx) do
      current_ability = ctx[:current_ability]
      convention = ctx[:convention]
      if args[:includeDropped]
        return false unless current_ability.can?(:manage, Event.new(convention: convention))
      end

      true
    end

    resolve ->(_obj, args, ctx) {
      events = ctx[:convention].events
      events = events.active unless args['includeDropped']
      signup_scope = Signup.where(run_id: Run.where(event_id: events.map(&:id)).select(:id))

      ctx[:confirmed_signup_count_by_run_id] = signup_scope.confirmed.counted.group(:run_id).count

      if args['extendedCounts']
        ctx[:waitlisted_signup_count_by_run_id] = signup_scope.waitlisted.counted
          .group(:run_id)
          .count
        ctx[:not_counted_signup_count_by_run_id] = signup_scope.not_counted.group(:run_id).count
      end

      events
    }
  end

  field :my_signups, types[Types::SignupType] do
    resolve ->(_obj, _args, ctx) {
      ctx[:user_con_profile].signups
    }
  end

  field :current_user_con_profile, Types::UserConProfileType do
    resolve ->(_obj, _args, ctx) {
      ctx[:user_con_profile]
    }
  end

  field :userConProfile, Types::UserConProfileType do
    argument :id, !types.Int

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].user_con_profiles.find(args[:id]))
    end

    resolve ->(_obj, args, ctx) {
      ctx[:convention].user_con_profiles.find(args[:id])
    }
  end

  field :form, Types::FormType do
    argument :id, !types.Int

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].forms.find(args[:id]))
    end

    resolve ->(_obj, args, ctx) {
      ctx[:convention].forms.find(args[:id])
    }
  end

  field :staffPosition, Types::StaffPositionType do
    argument :id, !types.Int

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].staff_positions.find(args[:id]))
    end

    resolve ->(_obj, args, ctx) {
      ctx[:convention].staff_positions.find(args[:id])
    }
  end

  field :previewMarkdown, !types.String do
    argument :markdown, !types.String

    resolve ->(_obj, args, _ctx) do
      MarkdownPresenter.new('').render(args[:markdown])
    end
  end
end
