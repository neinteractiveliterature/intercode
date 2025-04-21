# frozen_string_literal: true
class Mutations::UpdateNotificationTemplate < Mutations::BaseMutation
  description <<~MARKDOWN
    Updates a notification template for a given event key.
  MARKDOWN

  field :notification_template, Types::NotificationTemplateType, null: false do
    description "The updated notification template"
  end

  argument :add_destinations, [Types::NotificationDestinationInputType], required: false, camelize: false do
    description "The destinations to add to the notification template"
  end
  argument :event_key, Types::NotificationEventKey, required: true, camelize: false do
    description "The event key of the notification template to update"
  end
  argument :notification_template, Types::NotificationTemplateInputType, required: true, camelize: false do
    description "The new values for the notification template"
  end
  argument :remove_destination_ids, [ID], required: false, camelize: false do
    description "The IDs of the destinations to remove from the notification template"
  end

  load_and_authorize_convention_associated_model :notification_templates, :event_key, :update

  def resolve(**args)
    add_destinations = args.delete(:add_destinations)
    remove_destination_ids = args.delete(:remove_destination_ids)

    add_destinations&.each do |destination|
      destination_params = destination.to_h

      if destination_params[:conditions]
        destination_params[:conditions] = destination_params[:conditions].to_h do |condition|
          [condition[:condition_type], condition[:value]]
        end
      end

      notification_template.notification_destinations.create!(destination_params)
    end
    if remove_destination_ids.present?
      notification_template.notification_destinations.where(id: remove_destination_ids).destroy_all
    end

    notification_template.update!(args[:notification_template].to_h)

    { notification_template: }
  end
end
