class ApplicationService
  include ActiveModel::Validations

  class << self
    attr_accessor :result_class
  end

  def call
    return failure(errors) unless valid?

    inner_call
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
end