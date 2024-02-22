# frozen_string_literal: true
class Sources::EventRating < GraphQL::Dataloader::Source
  attr_reader :user_con_profile

  def initialize(user_con_profile)
    @user_con_profile = user_con_profile
  end

  def fetch(keys)
    event_ratings_by_event_id =
      user_con_profile.event_ratings.where(event_id: keys.map(&:id)).pluck(:event_id, :rating).to_h

    keys.map { |event| event_ratings_by_event_id[event.id] }
  end
end
