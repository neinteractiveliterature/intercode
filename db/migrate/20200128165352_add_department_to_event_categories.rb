class AddDepartmentToEventCategories < ActiveRecord::Migration[6.0]
  def change
    add_reference :event_categories, :department, null: true, foreign_key: true
  end
end
