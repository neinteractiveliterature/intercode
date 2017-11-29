class AddDefaultValueToFormItems < ActiveRecord::Migration[5.1]
  def change
    add_column :form_items, :default_value, :text
  end
end
