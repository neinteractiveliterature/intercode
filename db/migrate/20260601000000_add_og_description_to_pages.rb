# frozen_string_literal: true

class AddOgDescriptionToPages < ActiveRecord::Migration[8.1]
  def change
    add_column :pages, :cached_og_description, :text
    reversible { |dir| dir.up { Page.find_each { |page| CachePageOgDescriptionJob.perform_later(page) } } }
  end
end
