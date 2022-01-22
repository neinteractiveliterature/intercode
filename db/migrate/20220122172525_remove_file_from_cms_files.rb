class RemoveFileFromCmsFiles < ActiveRecord::Migration[7.0]
  def change
    remove_column :cms_files, :file, :string, null: false
  end
end
