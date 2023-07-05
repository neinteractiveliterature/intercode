class MakeRunEventIdNotNullable < ActiveRecord::Migration[7.0]
  def change
    change_column_null :runs, :event_id, false
  end
end
