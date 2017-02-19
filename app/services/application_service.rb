class ApplicationService
  class ServiceFailure < StandardError
    attr_reader :service, :result

    def initialize(service, result)
      @service = service
      @result = result
      super("#{service.class.name} failed: #{result.errors.full_messages.join(', ')}")
    end
  end

  include ActiveModel::Validations

  attr_reader :skip_locking

  class << self
    attr_accessor :result_class

    def result_class
      @result_class || ServiceResult
    end
  end

  def call
    return failure(errors) unless valid?

    inner_call
  end

  def call!
    raise ServiceFailure.new(self, failure(errors)) unless valid?

    result = inner_call
    raise ServiceFailure.new(self, result) if result.failure?
    result
  end

  private

  def success(attributes = {})
    self.class.result_class.success(attributes)
  end

  def failure(errors, attributes = {})
    self.class.result_class.failure(attributes.merge(errors: errors))
  end

  def inner_call
    raise "Subclasses are expected to override #inner_call"
  end

  def with_advisory_lock_unless_skip_locking(name, &block)
    if skip_locking
      yield
    else
      ActiveRecord::Base.with_advisory_lock(name, &block)
    end
  end
end