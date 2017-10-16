class RemoveNotifyOnChangesFromEvents < ActiveRecord::Migration[5.1]
  def change
    remove_column :events, :notify_on_changes, :boolean
  end
end
