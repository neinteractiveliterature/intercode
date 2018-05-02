class MakeCanPlayConcurrentlyDefaultFalse < ActiveRecord::Migration[5.2]
  def up
    change_column :events, :can_play_concurrently, :boolean, null: false, default: false
  end

  def down
    change_column :events, :can_play_concurrently, :boolean, null: true, default: nil
  end
end
