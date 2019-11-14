class MySignupRequestsLoader < GraphQL::Batch::Loader
  attr_reader :user_con_profile

  def initialize(user_con_profile)
    @user_con_profile = user_con_profile
  end

  def perform(keys)
    signup_request_scope = user_con_profile.signup_requests.where(target_run_id: keys.map(&:id))
      .includes(target_run: { event: :convention })

    signup_requests_by_run_id = signup_request_scope.to_a.group_by(&:run_id)
    keys.each do |run|
      fulfill(run, signup_requests_by_run_id[run.id] || [])
    end
  end
end
