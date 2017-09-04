Types::QueryType = GraphQL::ObjectType.define do
  name "Query"
  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  field :convention, Types::ConventionType do
    resolve ->(_obj, _args, ctx) {
      ctx[:convention]
    }
  end

  field :event, Types::EventType do
    argument :id, !types.Int

    resolve ->(_obj, args, ctx) {
      ctx[:convention].events.active.includes(:runs).find(args[:id])
    }
  end

  field :events, types[Types::EventType] do
    resolve ->(_obj, _args, ctx) {
      events = ctx[:convention].events.active.includes(:runs => [:rooms])

      ctx[:confirmed_signup_count_by_run_id] = Signup.confirmed.counted.where(
        run_id: Run.where(event_id: events.map(&:id)).select(:id)
      ).group(:run_id).count
      
      events
    }
  end

  field :my_signups, types[Types::SignupType] do
    resolve ->(_obj, _args, ctx) {
      ctx[:user_con_profile].signups
    }
  end
end
