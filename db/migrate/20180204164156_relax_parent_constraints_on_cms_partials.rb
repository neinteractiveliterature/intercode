class RelaxParentConstraintsOnCmsPartials < ActiveRecord::Migration[5.1]
  def change
    reversible do |dir|
      dir.up do
        change_column :cms_partials, :parent_id, :integer, null: true
      end

      dir.down do
        change_column :cms_partials, :parent_id, :integer, null: false
      end
    end
  end
end
