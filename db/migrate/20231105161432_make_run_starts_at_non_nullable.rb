class MakeRunStartsAtNonNullable < ActiveRecord::Migration[7.0]
  def change
    change_column_null :runs, :starts_at, false
  end
end
