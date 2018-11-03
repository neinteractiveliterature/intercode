class CreateCmsLayoutReferenceJoinTables < ActiveRecord::Migration[5.2]
  create_join_table :cms_files, :cms_layouts
  create_join_table :cms_partials, :cms_layouts

  CmsLayout.find_each do |cms_layout|
    say "Calculating references for #{cms_layout.parent ? cms_layout.parent.name : 'global'} layout #{cms_layout.name}"
    cms_layout.send(:set_performance_metadata)
    cms_layout.save!
  end
end
