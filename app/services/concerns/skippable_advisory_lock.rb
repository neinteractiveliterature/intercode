# frozen_string_literal: true
module SkippableAdvisoryLock
  attr_reader :skip_locking

  def with_advisory_lock_unless_skip_locking(name, &)
    if skip_locking
      yield
    else
      ActiveRecord::Base.with_advisory_lock(name, transaction: true, &)
    end
  end
end
