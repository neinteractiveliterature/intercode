class CreateEventCategories < ActiveRecord::Migration[5.2]
  LEGACY_EVENT_CATEGORIES = [
    { key: "board_game", name: "Board game" },
    { key: "con_services", name: "Con services", scheduling_ui: 'single_run' },
    { key: "filler", name: "Filler event", scheduling_ui: 'single_run' },
    { key: "larp", name: "Larp", team_member_name: "GM" },
    { key: "meetup", name: "Meetup", scheduling_ui: 'single_run', team_member_name: "host" },
    { key: "moderated_discussion", name: "Moderated discussion", scheduling_ui: 'single_run', team_member_name: "moderator" },
    { key: "panel", name: "Panel", scheduling_ui: 'single_run', team_member_name: "panelist" },
    { key: "party", name: "Party", scheduling_ui: 'single_run', team_member_name: "host" },
    { key: "presentation", name: "Presentation", scheduling_ui: 'single_run', team_member_name: "presenter" },
    { key: "tabletop_rpg", name: "Tabletop RPG", team_member_name: "GM" },
    { key: "town_hall", name: "Town hall", scheduling_ui: 'single_run', team_member_name: "facilitator" },
    { key: "workshop", name: "Workshop", scheduling_ui: 'single_run', team_member_name: "facilitator" },
    { key: "volunteer_event", name: "Volunteer event", scheduling_ui: 'recurring' }
  ].index_by { |category| category[:key] }

  def change
    create_table :event_categories do |t|
      t.references :convention, null: false, foreign_key: true
      t.text :name, null: false
      t.text :team_member_name, null: false
      t.text :scheduling_ui, null: false
      t.references :event_form, null: false, foreign_key: { to_table: 'forms' }
      t.references :event_proposal_form, foreign_key: { to_table: 'forms' }

      t.timestamps
    end

    add_reference :events, :event_category, foreign_key: true

    reversible do |dir|
      dir.up do
        say 'Adding categories to all events based on legacy category key'

        Event.includes(:convention).find_each do |event|
          convention = event.convention
          legacy_category = LEGACY_EVENT_CATEGORIES[event.category]
          event_category = convention.event_categories.find_or_create_by!(
            name: legacy_category[:name]
          ) do |new_category|
            new_category.scheduling_ui = legacy_category[:scheduling_ui] || 'regular'
            new_category.team_member_name = legacy_category[:team_member_name] || 'team member'

            new_category.event_form_id = case legacy_category[:scheduling_ui]
            when 'recurring' then convention.volunteer_event_form_id
            when 'single_run' then convention.filler_event_form_id
            else convention.regular_event_form_id
            end

            if legacy_category[:key] == 'larp'
              new_category.event_proposal_form_id = convention.event_proposal_form_id
            end
          end

          event.update!(event_category: event_category)
        end
      end

      dir.down do
        say 'Adding legacy category keys to all events'

        Event.includes(:event_category).find_each do |event|
          legacy_category = LEGACY_EVENT_CATEGORIES.values.find do |lc|
            lc[:name] == event.event_category.name
          end

          event.update!(category: legacy_category[:key])
        end
      end
    end

    change_column_null :events, :event_category_id, false
    remove_column :events, :category, :string
  end
end
