class CreateCmsReferenceJoinTables < ActiveRecord::Migration[5.1]
  def change
    create_join_table :cms_files, :pages
    create_join_table :cms_partials, :pages

    Page.find_each do |page|
      say "Calculating references for #{page.parent ? page.parent.name : 'global'} page #{page.slug}"
      page.send(:set_references)
      page.save!
    end
  end
end
