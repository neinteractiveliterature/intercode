class IndexNotifiedAtOnFormResponseChanges < ActiveRecord::Migration[5.1]
  def change
    add_index :form_response_changes, :notified_at
  end
end
