class AddMetaDescriptionToPages < ActiveRecord::Migration[8.0]
  def change
    add_column :pages, :meta_description, :text
  end
end
