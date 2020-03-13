class NotificationsMailer < ApplicationMailer
  def notification(convention:, subject:, body_html:, body_text:, to:)
    use_convention_timezone(convention) do
      mail(
        subject: subject, from: convention.email_from, to: to
      ) do |format|
        format.html do
          @body_html = body_html.html_safe
          render 'notifications/notification', layout: 'mailer'
        end

        if body_text.present?
          format.text do
            render plain: body_text
          end
        end
      end
    end
  end
end
