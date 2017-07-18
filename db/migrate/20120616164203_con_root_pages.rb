class ConRootPages < ActiveRecord::Migration[5.1]
  def change
    change_table :cons do |t|
      t.references :root_page
    end
  end
end
