class AddExposeInToFormItems < ActiveRecord::Migration[7.0]
  def change
    add_column :form_items, :expose_in, :text, array: true
  end
end
