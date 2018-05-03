class SignupCountLoader < GraphQL::Batch::Loader
  def perform(keys)
    ::ActiveRecord::Associations::Preloader.new.preload(keys, :signups)
    keys.each do |run|
      fulfill(run, SignupCountPresenter.new(run))
    end
  end
end
