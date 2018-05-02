class MakeCanPlayConcurrentlyDefaultFalse < ActiveRecord::Migration[5.2]
  def up
    Event.where(can_play_concurrently: nil).update_all(can_play_concurrently: false)
    change_column :events, :can_play_concurrently, :boolean, null: false, default: false
  end

  def down
    change_column :events, :can_play_concurrently, :boolean, null: true, default: nil
  end
end
