# frozen_string_literal: true

class AddOgDescriptionToPages < ActiveRecord::Migration[8.1]
  def change
    add_column :pages, :cached_og_description, :text
    reversible do |dir|
      dir.up do
        Page.find_each do |page|
          say "Caching OpenGraph description for #{page.parent&.name || "root site"} #{page.name}"
          CachePageOgDescriptionJob.perform_now(page)
        end
      end
    end
  end
end
