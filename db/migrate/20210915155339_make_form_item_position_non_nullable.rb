class MakeFormItemPositionNonNullable < ActiveRecord::Migration[6.1]
  def change
    change_column_null :form_items, :position, false
    change_column_null :form_sections, :position, false
  end
end
