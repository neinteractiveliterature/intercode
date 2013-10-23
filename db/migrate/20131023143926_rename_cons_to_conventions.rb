class RenameConsToConventions < ActiveRecord::Migration
  def up
    rename_table :cons, :conventions
    rename_column :events, :con_id, :convention_id
    rename_column :user_con_profiles, :con_id, :convention_id
    
    execute "UPDATE pages SET parent_type = 'Convention' WHERE parent_type = 'Con'"
  end
  
  def down
    execute "UPDATE pages SET parent_type = 'Con' WHERE parent_type = 'Convention'"
    
    rename_column :user_con_profiles, :convention_id, :con_id
    rename_column :events, :convention_id, :con_id
    rename_table :conventions, :cons
  end
end
