# frozen_string_literal: true
class Sources::SignupCount < GraphQL::Dataloader::Source
  def fetch(keys)
    presenters_by_run_id = SignupCountPresenter.for_runs(keys)
    keys.map { |run| presenters_by_run_id[run.id] }
  end
end
