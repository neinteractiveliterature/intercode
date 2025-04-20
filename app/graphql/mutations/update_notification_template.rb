# frozen_string_literal: true
class Mutations::UpdateNotificationTemplate < Mutations::BaseMutation
  description <<~MARKDOWN
    Updates a notification template for a given event key.
  MARKDOWN

  field :notification_template, Types::NotificationTemplateType, null: false do
    description "The updated notification template"
  end

  argument :event_key, Types::NotificationEventKey, required: true, camelize: false do
    description "The event key of the notification template to update"
  end
  argument :notification_template, Types::NotificationTemplateInputType, required: true, camelize: false do
    description "The new values for the notification template"
  end

  load_and_authorize_convention_associated_model :notification_templates, :event_key, :update

  def resolve(**args)
    notification_template.update!(args[:notification_template].to_h)

    { notification_template: }
  end
end
