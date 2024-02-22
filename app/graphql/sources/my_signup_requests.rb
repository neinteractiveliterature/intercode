# frozen_string_literal: true
class Sources::MySignupRequests < GraphQL::Dataloader::Source
  attr_reader :user_con_profile

  def initialize(user_con_profile)
    @user_con_profile = user_con_profile
  end

  def fetch(keys)
    signup_request_scope = user_con_profile.signup_requests.where(target_run_id: keys.map(&:id))
    signup_requests_by_target_run_id = signup_request_scope.to_a.group_by(&:target_run_id)
    keys.map { |run| signup_requests_by_target_run_id[run.id] || [] }
  end
end
