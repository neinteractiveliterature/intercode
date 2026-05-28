# frozen_string_literal: true
class AddAuthLayoutToRootSites < ActiveRecord::Migration[7.2]
  def change
    add_reference :root_sites, :auth_layout, foreign_key: { to_table: :cms_layouts }, null: true
  end
end
