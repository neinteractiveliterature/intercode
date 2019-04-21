class UnHardcodeNavbarClasses < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        execute <<~SQL
          UPDATE cms_layouts
          SET navbar_classes = 'navbar-fixed-top navbar-expand-md mb-4 ' || navbar_classes
          WHERE navbar_classes IS NOT NULL AND navbar_classes != ''
        SQL
      end
    end
  end
end
