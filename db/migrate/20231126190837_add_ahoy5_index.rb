class AddAhoy5Index < ActiveRecord::Migration[7.1]
  def change
    add_index :ahoy_visits, %i[visitor_token started_at]
  end
end
