# frozen_string_literal: true
class RegistrationPolicy::Error
  attr_reader :message

  def initialize(message)
    @message = message
  end
end
