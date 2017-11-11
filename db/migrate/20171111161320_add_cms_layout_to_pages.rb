class AddCmsLayoutToPages < ActiveRecord::Migration[5.1]
  def change
    add_reference :pages, :cms_layout, foreign_key: true
  end
end
