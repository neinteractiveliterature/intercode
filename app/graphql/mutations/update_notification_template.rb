class Mutations::UpdateNotificationTemplate < Mutations::BaseMutation
  field :notification_template, Types::NotificationTemplateType, null: false

  argument :event_key, String, required: true, camelize: false
  argument :notification_context_type, Types::NotificationContextTypeIndicator, required: false, camelize: false
  argument :notification_context_id, ID, required: false, camelize: false
  argument :notification_template, Types::NotificationTemplateInputType, required: true, camelize: false

  attr_reader :notification_template

  def authorized?(args)
    @notification_template = convention.notification_templates.where(
      event_key: args[:event_key],
      notification_context_type: args[:notification_context_type],
      notification_context_id: args[:notification_context_id]
    ).first!
    self.class.check_authorization(policy(notification_template), :update)
  end

  def resolve(**args)
    notification_template.update!(args[:notification_template].to_h)

    { notification_template: notification_template }
  end
end
