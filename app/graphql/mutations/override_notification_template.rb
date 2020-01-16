class Mutations::OverrideNotificationTemplate < Mutations::BaseMutation
  field :notification_template, Types::NotificationTemplateType, null: false

  argument :event_key, String, required: true, camelize: false
  argument :notification_context_type, Types::NotificationContextTypeIndicator, required: false, camelize: false
  argument :notification_context_id, ID, required: false, camelize: false

  authorize_create_convention_associated_model :notification_templates

  def resolve(**args)
    base_template = convention.notification_templates.where(
      event_key: args[:event_key],
      notification_context_type: nil,
      notification_context_id: nil
    ).first!

    notification_template = convention.notification_templates.create!(
      base_template.attributes.symbolize_keys.except(:created_at, :updated_at).merge(
        notification_context_type: args[:notification_context_type],
        notification_context_id: args[:notification_context_id]
      )
    )

    { notification_template: notification_template }
  end
end
