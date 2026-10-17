# frozen_string_literal: true
class NormalizeEventCategoryNotificationConditions < ActiveRecord::Migration[8.1]
  class MigrationNotificationDestination < ActiveRecord::Base
    self.table_name = "notification_destinations"
  end

  class MigrationEventCategory < ActiveRecord::Base
    self.table_name = "event_categories"
  end

  # Convention cloning used to store entire serialized EventCategory records (or nil) in the event_category
  # condition instead of the category's ID.  Neither form can ever match, so replace records with their IDs
  # where the category still exists, and delete destinations whose category can't be resolved (they could
  # never have fired).
  def up
    MigrationNotificationDestination
      .where("conditions ? 'event_category'")
      .find_each do |destination|
        value = destination.conditions["event_category"]
        next if value.is_a?(Integer)

        category_id = value.is_a?(Hash) ? value["id"] : nil
        if category_id && MigrationEventCategory.exists?(id: category_id)
          destination.update!(conditions: destination.conditions.merge("event_category" => category_id))
        else
          destination.delete
        end
      end
  end

  def down
    # irreversible data cleanup
  end
end
