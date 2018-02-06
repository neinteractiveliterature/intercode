class AbilityLoader < GraphQL::Batch::Loader
  def initialize(model)
    @model = model

    return if [User, UserConProfile].include?(model)
    raise 'model must be either User or UserConProfile'
  end

  def perform(keys)
    associated_records_loader = associated_records_loader(keys)
    users_with_keys(keys).each do |(key, user)|
      fulfill(key, Ability.new(user, associated_records_loader: associated_records_loader))
    end
    keys.each { |key| fulfill(key, nil) unless fulfilled?(key) }
  end

  private

  def user_ids(keys)
    if @model == UserConProfile
      keys.map(&:user_id)
    else
      keys.map(&:id)
    end
  end

  def associated_records_loader(keys)
    Ability::AssociatedRecordsLoader.new(user_ids(keys))
  end

  def users_with_keys(keys)
    if @model == UserConProfile
      user_con_profiles_by_user_id = keys.index_by(&:user_id)
      User.where(id: user_con_profiles_by_user_id.keys).map do |user|
        [user_con_profiles_by_user_id[user.id], user]
      end
    else
      keys.map { |user| [user, user] }
    end
  end
end
