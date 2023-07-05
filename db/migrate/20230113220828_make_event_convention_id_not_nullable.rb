class MakeEventConventionIdNotNullable < ActiveRecord::Migration[7.0]
  def change
    change_column_null :events, :convention_id, false
  end
end
