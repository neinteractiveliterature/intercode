class MySignupsLoader < GraphQL::Batch::Loader
  attr_reader :pundit_user

  def initialize(pundit_user)
    @pundit_user = pundit_user
  end

  def perform(keys)
    signup_scope = Signup.where(user_con_profile_id: keys.map(&:id))
      .includes(run: { event: :convention })
    signups_by_user_con_profile_id = signup_scope.to_a.group_by(&:user_con_profile_id)
    keys.each do |user_con_profile|
      fulfill(user_con_profile, signups_by_user_con_profile_id[user_con_profile.id] || [])
    end
  end
end
