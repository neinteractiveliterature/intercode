class MakeRunStartsAtNonNullable < ActiveRecord::Migration[6.0]
  def change
    change_column_null :events, :length_seconds, false
    change_column_null :runs, :starts_at, false
  end
end
