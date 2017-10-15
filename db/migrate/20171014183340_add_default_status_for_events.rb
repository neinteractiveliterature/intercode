class AddDefaultStatusForEvents < ActiveRecord::Migration[5.1]
  def change
    reversible do |dir|
      dir.up { execute "UPDATE events SET status = 'active' WHERE status IS NULL" }
    end

    change_column :events, :status, :string, null: false, default: 'active'
  end
end
