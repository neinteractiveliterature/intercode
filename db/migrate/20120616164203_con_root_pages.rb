class ConRootPages < ActiveRecord::Migration
  def change
    change_table :cons do |t|
      t.references :root_page
    end
  end
end
