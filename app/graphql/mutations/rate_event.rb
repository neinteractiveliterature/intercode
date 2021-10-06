# frozen_string_literal: true
class Mutations::RateEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :event_id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_event_id, ID, required: false, camelize: true
  argument :rating, Integer, required: true

  define_authorization_check { |_args| !!user_con_profile && !assumed_identity_from_profile }

  def resolve(event_id:, rating:)
    event_rating = user_con_profile.event_ratings.find_or_initialize_by(event_id: event_id)
    event_rating.rating = rating
    event_rating.save!

    { event: event_rating.event }
  end
end
