module SkippableAdvisoryLock
  attr_reader :skip_locking

  def with_advisory_lock_unless_skip_locking(name, &block)
    if skip_locking
      yield
    else
      ActiveRecord::Base.with_advisory_lock(name, transaction: true, &block)
    end
  end
end
