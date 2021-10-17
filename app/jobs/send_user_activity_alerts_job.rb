# frozen_string_literal: true
class SendUserActivityAlertsJob < ApplicationJob
  def perform(user_con_profile, event)
    SendUserActivityAlertsService.new(user_con_profile: user_con_profile, event: event).call!
  end
end
