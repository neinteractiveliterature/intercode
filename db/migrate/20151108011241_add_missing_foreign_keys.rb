class AddMissingForeignKeys < ActiveRecord::Migration[4.2]
  def change
    rename_column :events, :user_id, :owner_id

    [:conventions, :events, :runs].each do |from_table|
      add_foreign_key from_table, :users, column: 'updated_by_id'
    end

    add_foreign_key :conventions, :pages, column: 'root_page_id'
    add_foreign_key :events, :conventions
    add_foreign_key :events, :users, column: 'owner_id'
    add_foreign_key :runs, :events
    add_foreign_key :team_members, :events
    add_foreign_key :team_members, :users
    add_foreign_key :user_con_profiles, :conventions
    add_foreign_key :user_con_profiles, :events, column: 'comp_event_id'
    add_foreign_key :user_con_profiles, :users
  end
end
