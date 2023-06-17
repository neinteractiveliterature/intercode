# frozen_string_literal: true
class SignupCountLoader < GraphQL::Batch::Loader
  def perform(keys)
    # presenters_by_run_id = SignupCountPresenter.for_run_ids(keys)
    # keys.each { |run_id| fulfill(run_id, presenters_by_run_id.fetch(run_id)) }

    data_by_run_id = IntercodeWarpCore.load_signup_count_data_for_run_ids(keys)
    keys.each { |run_id| fulfill(run_id, data_by_run_id.fetch(run_id)) }
  end
end
