# frozen_string_literal: true
class Mutations::RateEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :transitional_event_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the eventId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :event_id, ID, required: false, camelize: true
  argument :rating, Integer, required: true

  define_authorization_check { |_args| !!user_con_profile && !assumed_identity_from_profile }

  def resolve(rating:, event_id: nil, transitional_event_id: nil)
    event_rating = user_con_profile.event_ratings.find_or_initialize_by(event_id: transitional_event_id || event_id)
    event_rating.rating = rating
    event_rating.save!

    { event: event_rating.event }
  end
end
