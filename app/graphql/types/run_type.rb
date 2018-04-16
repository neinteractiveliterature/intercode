class Types::RunType < Types::BaseObject

  field :id, Integer, null: false
  field :event, Types::EventType, null: true
  field :starts_at, Types::DateType, null: true
  field :title_suffix, String, null: true
  field :schedule_note, String, null: true

  field :rooms, [Types::RoomType, null: true], null: true

  def rooms
    AssociationLoader.for(Run, :rooms).load(@object)
  end

  field :confirmed_signup_count, Integer, null: true

  def confirmed_signup_count
    @context[:confirmed_signup_count_by_run_id][@object.id] || 0
  end

  field :waitlisted_signup_count, Integer, null: true

  def waitlisted_signup_count
    @context[:waitlisted_signup_count_by_run_id][@object.id] || 0
  end

  field :not_counted_signup_count, Integer, null: true

  def not_counted_signup_count
    @context[:not_counted_signup_count_by_run_id][@object.id] || 0
  end

  field :my_signups, [Types::SignupType, null: true], null: true

  def my_signups
    return [] unless @context[:user_con_profile]
    @context[:user_con_profile].signups.select { |signup| signup.run_id == @object.id }
  end
end
