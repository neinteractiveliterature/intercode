# frozen_string_literal: true
class Mutations::SendNotificationPreview < Mutations::BaseMutation
  description <<~MARKDOWN
  Sends a preview of a given notification template to a given user.
MARKDOWN

  argument :email, Boolean, required: true
  argument :event_key, Types::NotificationEventKey, required: true, camelize: false
  argument :sms, Boolean, required: true

  load_and_authorize_convention_associated_model :notification_templates, :event_key, :read

  def resolve(**args)
    notifier =
      NotifierPreviewFactory.new(
        convention: notification_template.convention,
        event_key: notification_template.event_key
      ).notifier
    notifier.deliver_preview(user_con_profile:, email: args[:email], sms: args[:sms])

    {}
  end
end
