class AddInvariantToPages < ActiveRecord::Migration[5.2]
  def change
    add_column :pages, :invariant, :boolean, null: false, default: false

    reversible do |dir|
      dir.up do
        Page.find_each do |page|
          page.update!(invariant: page.template_invariant?)
        end
      end
    end
  end
end
