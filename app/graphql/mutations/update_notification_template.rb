class Mutations::UpdateNotificationTemplate < Mutations::BaseMutation
  field :notification_template, Types::NotificationTemplateType, null: false

  argument :event_key, String, required: true, camelize: false
  argument :notification_template, Types::NotificationTemplateInputType,
    required: true, camelize: false

  load_and_authorize_convention_associated_model :notification_templates, :event_key, :update

  def resolve(**args)
    notification_template.update!(args[:notification_template].to_h)

    { notification_template: notification_template }
  end
end
