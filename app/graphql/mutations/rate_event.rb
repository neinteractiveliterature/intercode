class Mutations::RateEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :event_id, Integer, required: true, camelize: false
  argument :rating, Integer, required: true

  define_authorization_check do |_args|
    !!user_con_profile && !assumed_identity_from_profile
  end

  def resolve(event_id:, rating:)
    event_rating = user_con_profile.event_ratings.find_or_initialize_by(event_id: event_id)
    event_rating.rating = rating
    event_rating.save!

    { event: event_rating.event }
  end
end
