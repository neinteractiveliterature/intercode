class Sources::AuthorizationInfo < GraphQL::Dataloader::Source
  def initialize(model)
    @model = model

    return if [User, UserConProfile].include?(model)
    raise ArgumentError, "model must be either User or UserConProfile"
  end

  def fetch(keys)
    authorization_info_by_key = {}
    users_with_keys(keys).each do |(key, user)|
      known_user_con_profiles = model.is_a?(UserConProfile) ? [model] : []
      authorization_info_by_key[key] = AuthorizationInfo.new(
        user,
        nil,
        known_user_con_profiles:
      )
    end
    keys.map { |key| authorization_info_by_key[key] }
  end

  private

  def user_ids(keys)
    @model == UserConProfile ? keys.map(&:user_id) : keys.map(&:id)
  end

  def users_with_keys(keys)
    if @model == UserConProfile
      user_con_profiles_by_user_id = keys.index_by(&:user_id)
      User.where(id: user_con_profiles_by_user_id.keys).map { |user| [user_con_profiles_by_user_id[user.id], user] }
    else
      keys.map { |user| [user, user] }
    end
  end
end
