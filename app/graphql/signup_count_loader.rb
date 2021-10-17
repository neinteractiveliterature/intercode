# frozen_string_literal: true
class SignupCountLoader < GraphQL::Batch::Loader
  def perform(keys)
    presenters_by_run_id = SignupCountPresenter.for_runs(keys)
    keys.each { |run| fulfill(run, presenters_by_run_id[run.id]) }
  end
end
