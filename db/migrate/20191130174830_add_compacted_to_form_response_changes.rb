class AddCompactedToFormResponseChanges < ActiveRecord::Migration[6.0]
  def change
    add_column :form_response_changes, :compacted, :boolean, null: false, default: false
    add_index :form_response_changes, :compacted
  end
end
