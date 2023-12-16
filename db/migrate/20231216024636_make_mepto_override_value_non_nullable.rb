class MakeMeptoOverrideValueNonNullable < ActiveRecord::Migration[7.1]
  def change
    change_column_null :maximum_event_provided_tickets_overrides, :override_value, false
  end
end
