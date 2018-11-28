class AddPublicDescriptionToFormItems < ActiveRecord::Migration[5.2]
  def change
    add_column :form_items, :public_description, :text
  end
end
