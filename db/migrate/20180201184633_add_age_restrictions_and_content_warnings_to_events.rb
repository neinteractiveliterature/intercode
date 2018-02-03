class AddAgeRestrictionsAndContentWarningsToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :age_restrictions, :text
    add_column :events, :content_warnings, :text
  end
end
