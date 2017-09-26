Mutations::CreateVolunteerEvent = GraphQL::Relay::Mutation.define do
  name "CreateVolunteerEvent"
  return_field :event, Types::EventType

  input_field :title, !types.String
  input_field :email, !types.String
  input_field :short_blurb, !types.String
  input_field :description, !types.String
  input_field :length_seconds, !types.Int
  input_field :total_slots, !types.Int

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.create!(
      category: 'volunteer_event',
      status: 'active',
      can_play_concurrently: false,
      con_mail_destination: 'event_email',
      author: "#{ctx[:convention].name} Staff",
      updated_by: ctx[:user_con_profile].user,
      title: args[:title],
      email: args[:email],
      short_blurb: args[:short_blurb],
      description: args[:description],
      length_seconds: args[:length_seconds],
      registration_policy: RegistrationPolicy.new(
        buckets: [
          RegistrationPolicy::Bucket.new(
            key: 'signups',
            name: 'Signups',
            description: 'Signups for this event',
            anything: false,
            slots_limited: true,
            minimum_slots: 1,
            preferred_slots: args[:preferred_slots],
            total_slots: args[:total_slots]
          )
        ]
      )
    )

    { event: event }
  }
end
