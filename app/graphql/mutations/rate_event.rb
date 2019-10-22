class Mutations::RateEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :event_id, Integer, required: true, camelize: false
  argument :rating, Integer, required: true

  require_user_con_profile

  def resolve(event_id:, rating:)
    event_rating = user_con_profile.event_ratings.find_or_initialize_by(event_id: event_id)
    event_rating.rating = rating
    event_rating.save!

    { event: event_rating.event }
  end
end
