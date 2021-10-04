# frozen_string_literal: true
class Mutations::DeleteUserActivityAlert < Mutations::BaseMutation
  field :user_activity_alert, Types::UserActivityAlertType, null: false, camelize: false

  argument :id,
           Int,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_convention_associated_model :user_activity_alerts, :id, :destroy

  def resolve(**_args)
    user_activity_alert.destroy!

    { user_activity_alert: user_activity_alert }
  end
end
