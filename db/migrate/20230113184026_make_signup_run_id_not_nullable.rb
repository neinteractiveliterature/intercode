class MakeSignupRunIdNotNullable < ActiveRecord::Migration[7.0]
  def change
    change_column_null :signups, :run_id, false
  end
end
