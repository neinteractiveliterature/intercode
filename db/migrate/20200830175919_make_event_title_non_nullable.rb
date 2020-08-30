class MakeEventTitleNonNullable < ActiveRecord::Migration[6.0]
  def change
    change_column_null :events, :title, false
  end
end
