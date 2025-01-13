# frozen_string_literal: true
class Sources::MySignupRequests < GraphQL::Dataloader::Source
  attr_reader :user

  def initialize(user)
    @user = user
  end

  def fetch(keys)
    signup_request_scope = user.signup_requests.where(target_run_id: keys.map(&:id))
    signup_requests_by_target_run_id = signup_request_scope.to_a.group_by(&:target_run_id)
    keys.map { |run| signup_requests_by_target_run_id[run.id] || [] }
  end
end
