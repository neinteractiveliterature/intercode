class FixNilStringInLayoutTypes < ActiveRecord::Migration[7.0]
  # Migration 20181217193826_create_root_sites accidentally used to insert the string 'nil' into the parent_type column
  # for the root site's default layout.  Rails actually let us get away with this previously, but doesn't anymore.
  def up
    execute <<~SQL
      UPDATE cms_layouts SET parent_type = NULL WHERE parent_type = 'nil'
    SQL
  end

  def down; end
end
