class AddInvariantToPages < ActiveRecord::Migration[5.2]
  def change
    add_column :pages, :invariant, :boolean, null: false, default: false

    reversible do |dir|
      dir.up do
        PgSearch.disable_multisearch do
          Page.find_each do |page|
            page.send(:set_performance_metadata)
            page.save!
          end
        end
      end
    end
  end
end
