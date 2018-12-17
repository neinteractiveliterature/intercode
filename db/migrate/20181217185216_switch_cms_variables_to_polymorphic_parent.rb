class SwitchCmsVariablesToPolymorphicParent < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :cms_variables, :conventions

    change_table :cms_variables do |t|
      t.rename :convention_id, :parent_id
      t.string :parent_type
    end

    change_column_null :cms_variables, :parent_id, true

    reversible do |dir|
      dir.up { CmsVariable.update_all(parent_type: 'Convention') }
    end
  end
end
