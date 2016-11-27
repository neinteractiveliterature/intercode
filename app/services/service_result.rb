class ServiceResult
  include ActiveModel::Model
  attr_accessor :success, :errors

  def self.success(attributes = {})
    new(attributes.merge(success: true))
  end

  def self.failure(attributes = {})
    new(attributes.merge(success: false))
  end

  def success?
    @success
  end

  def failure?
    !success?
  end
end