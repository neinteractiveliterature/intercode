class PreventBlankRecipientsInterceptor
  def self.delivering_email(message)
    return if message.to.present?

    message.perform_deliveries = false
    Rails.logger.debug 'Not delivering email because recipients are blank'
  end
end

ActionMailer::Base.register_interceptor(PreventBlankRecipientsInterceptor)
