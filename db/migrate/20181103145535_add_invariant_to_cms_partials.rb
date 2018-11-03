class AddInvariantToCmsPartials < ActiveRecord::Migration[5.2]
  def change
    add_column :cms_partials, :invariant, :boolean, null: false, default: false

    reversible do |dir|
      dir.up do
        CmsPartial.find_each do |cms_partial|
          cms_partial.update!(invariant: cms_partial.template_invariant?)
        end
      end
    end
  end
end
