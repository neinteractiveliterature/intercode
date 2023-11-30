class UpdateAllCmsReferences < ActiveRecord::Migration[7.1]
  def up
    [Page, CmsLayout, CmsPartial].each do |klass|
      klass.find_each do |model|
        say "Updating references for #{klass.name} #{model.id}"
        model.send(:set_performance_metadata)
        model.save!
      end
    end
  end

  def down
  end
end
