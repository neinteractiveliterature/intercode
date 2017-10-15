class RemovePlayerConstraintsFromEvents < ActiveRecord::Migration[5.1]
  def change
    remove_column :events, :player_constraints, :text
  end
end
