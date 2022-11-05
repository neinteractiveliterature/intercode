# frozen_string_literal: true
class ReceiveSnsEmailDeliveryJob < ApplicationJob
  def perform(message)
    ReceiveSnsEmailDeliveryService.new(message: message).call!
  end
end
