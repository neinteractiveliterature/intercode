class ConRootPages < ActiveRecord::Migration[4.2]
  def change
    change_table :cons do |t|
      t.references :root_page
    end
  end
end
