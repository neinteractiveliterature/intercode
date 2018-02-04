class FixParentIndexesOnCmsPartials < ActiveRecord::Migration[5.1]
  def change
    reversible do |dir|
      dir.up do
        change_table :cms_partials do |t|
          t.remove_index [:parent_id, :name]
          t.remove_index [:parent_id]

          t.index [:parent_id, :parent_type, :name], unique: true
          t.index [:parent_id, :parent_type]
        end
      end

      dir.down do
        change_table :cms_partials do |t|
          t.remove_index [:parent_id, :parent_type, :name]
          t.remove_index [:parent_id, :parent_type]

          t.index [:parent_id, :name], unique: true
          t.index [:parent_id]
        end
      end
    end
  end
end
