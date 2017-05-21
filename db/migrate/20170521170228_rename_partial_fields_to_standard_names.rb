class RenamePartialFieldsToStandardNames < ActiveRecord::Migration[5.0]
  def change
    change_table :cms_partials do |t|
      t.rename :convention_id, :parent_id
      t.string :parent_type
      t.rename :identifier, :name
    end

    reversible do |dir|
      dir.up { CmsPartial.update_all(parent_type: 'Convention') }
    end
  end
end
