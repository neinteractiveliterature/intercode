# frozen_string_literal: true
class NotificationsMailer < ApplicationMailer
  def notification(convention:, subject:, body_html:, body_text:, to:)
    use_convention_timezone(convention) do
      mail(subject: subject, from: convention.email_from, to: to) do |format|
        format.html do
          @body_html = body_html.html_safe
          render 'notifications/notification', layout: 'mailer'
        end

        format.text { render plain: body_text } if body_text.present?
      end
    end
  end
end
