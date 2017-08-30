class AddAdminDescriptionToFormItems < ActiveRecord::Migration[5.1]
  def change
    add_column :form_items, :admin_description, :text
  end
end
