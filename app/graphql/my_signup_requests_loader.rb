class MySignupRequestsLoader < GraphQL::Batch::Loader
  attr_reader :pundit_user

  def initialize(pundit_user)
    @pundit_user = pundit_user
  end

  def perform(keys)
    signup_request_scope = SignupRequestPolicy::Scope.new(
      pundit_user,
      SignupRequest.where(user_con_profile_id: keys.map(&:id)).includes(target_run: { event: :convention })
    ).resolve

    signup_requests_by_user_con_profile_id = signup_request_scope.to_a.group_by(&:user_con_profile_id)
    keys.each do |user_con_profile|
      fulfill(user_con_profile, signup_requests_by_user_con_profile_id[user_con_profile.id] || [])
    end
  end
end
