class RemoveCaptionFromFormItemsWhereInvalid < ActiveRecord::Migration[6.1]
  def up
    execute <<~SQL
    UPDATE form_items SET properties = (properties - 'caption')
    WHERE item_type in ('static_text', 'event_email', 'registration_policy')
    SQL
  end
end
