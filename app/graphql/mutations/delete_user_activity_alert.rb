module Mutations
  class DeleteUserActivityAlert < GraphQL::Schema::RelayClassicMutation
    field :user_activity_alert, Types::UserActivityAlert, null: false, camelize: false

    argument :id, Int, required: true

    def resolve(id:)
      alert = context[:convention].user_activity_alerts.find(id)
      alert.destroy!

      { user_activity_alert: alert }
    end
  end
end
