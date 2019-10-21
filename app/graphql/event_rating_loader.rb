class EventRatingLoader < GraphQL::Batch::Loader
  attr_reader :user_con_profile

  def initialize(user_con_profile)
    @user_con_profile = user_con_profile
  end

  def perform(keys)
    event_ratings_by_event_id = user_con_profile.event_ratings
      .where(event_id: keys.map(&:id))
      .pluck(:event_id, :rating)
      .to_h

    keys.each do |event|
      fulfill(event, event_ratings_by_event_id[event.id])
    end
  end
end
