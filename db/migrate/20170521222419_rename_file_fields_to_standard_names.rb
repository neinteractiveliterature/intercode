class RenameFileFieldsToStandardNames < ActiveRecord::Migration[5.0]
  def change
    remove_foreign_key :cms_files, :conventions

    change_table :cms_files do |t|
      t.rename :convention_id, :parent_id
      t.string :parent_type
    end

    reversible do |dir|
      dir.up { CmsFile.update_all(parent_type: 'Convention') }
    end
  end
end
