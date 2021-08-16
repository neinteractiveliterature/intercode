class AddPermissionFieldsToFormItems < ActiveRecord::Migration[6.1]
  def change
    add_column :form_items, :visibility, :string, default: 'normal', null: false
    add_column :form_items, :writeability, :string, default: 'normal', null: false
  end
end
