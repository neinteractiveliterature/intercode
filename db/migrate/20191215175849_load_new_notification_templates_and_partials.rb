class LoadNewNotificationTemplatesAndPartials < ActiveRecord::Migration[6.0]
  def up
    content_set = CmsContentSet.new(name: 'standard')

    Convention.find_each do |convention|
      say "Loading new content for #{convention.name}"
      CmsContentLoaders::CmsPartials.new(
        convention: convention, content_set: content_set,
        content_names: %w[move_results_list run_description],
        conflict_policy: :skip
      ).call!

      CmsContentLoaders::NotificationTemplates.new(
        convention: convention, content_set: content_set, conflict_policy: :skip
      ).call!
    end
  end

  def down
  end
end
