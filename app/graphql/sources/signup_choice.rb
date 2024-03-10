# frozen_string_literal: true
class Sources::SignupChoice < GraphQL::Dataloader::Source
  def fetch(keys)
    signups_by_user_con_profile_id = load_signups_by_user_con_profile_id(keys)

    keys.map do |signup|
      user_signups = signups_by_user_con_profile_id[signup.user_con_profile_id] || []
      index = user_signups.find_index(signup)
      index ? index + 1 : nil
    end
  end

  private

  def load_signups_by_user_con_profile_id(keys)
    Signup
      .where(counted: true, user_con_profile_id: keys.map(&:user_con_profile_id).uniq)
      .group_by(&:user_con_profile_id)
      .transform_values { |signups| signups.sort_by(&:created_at) }
  end
end
