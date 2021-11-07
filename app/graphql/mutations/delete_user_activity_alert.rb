# frozen_string_literal: true
class Mutations::DeleteUserActivityAlert < Mutations::BaseMutation
  field :user_activity_alert, Types::UserActivityAlertType, null: false, camelize: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :user_activity_alerts, :id, :destroy

  def resolve(**_args)
    user_activity_alert.destroy!

    { user_activity_alert: user_activity_alert }
  end
end
