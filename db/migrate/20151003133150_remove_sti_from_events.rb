class RemoveStiFromEvents < ActiveRecord::Migration[4.2]
  class Event < ApplicationRecord
  end

  EVENT_TYPE_MAPPING = {
    'Events::ConSuite' => 'volunteer_event',
    'Events::Filler' => 'filler',
    'Events::Larp' => 'larp',
    'Events::Ops' => 'volunteer_event',
    'Events::Panel' => 'panel',
    'Events::VolunteerEvent' => 'volunteer_event'
  }

  def change
    add_column :events, :category, :string

    reversible do |dir|
      dir.up do
        EVENT_TYPE_MAPPING.each do |type, category|
          RemoveStiFromEvents::Event.where(type: type).update_all(category: category)
        end
      end

      dir.down do
        EVENT_TYPE_MAPPING.invert.each do |category, type|
          RemoveStiFromEvents::Event.where(category: category).update_all(type: type)
        end
      end
    end

    remove_column :events, :type, :string
  end
end
