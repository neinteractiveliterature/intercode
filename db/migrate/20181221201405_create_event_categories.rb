class CreateEventCategories < ActiveRecord::Migration[5.2]
  COLOR_CLASSES = {
    aqua: {
      default: '#d4f5fa',
      full: 'rgba(212, 245, 250, 0.7)',
      signed_up: '#17a2b8'
    },
    green: {
      default: '#9be7ac',
      full: 'rgba(155, 231, 172, 0.6)',
      signed_up: '#28a745'
    },
    grey: {
      default: '#dee2e6',
      full: 'rgba(222, 226, 230, 0.6)',
      signed_up: '#495057'
    },
    indigo: {
      default: '#d2b9fb',
      full: 'rgba(210, 185, 251, 0.6)',
      signed_up: '#6610f2'
    },
    orange: {
      default: '#fed1ac',
      full: 'rgba(254, 209, 172, 0.5)',
      signed_up: '#fd7e14'
    },
    red: {
      default: '#f3b7bd',
      full: 'rgba(243, 183, 189, 0.5)',
      signed_up: '#dc3545'
    },
    teal: {
      default: '#94eed3',
      full: 'rgba(148, 238, 211, 0.5)',
      signed_up: '#20c997'
    },
    yellow: {
      default: '#ffeeba',
      full: 'rgba(255, 238, 186, 0.6)',
      signed_up: '#d6a100'
    }
  }

  LEGACY_EVENT_CATEGORIES =
    [
      { key: 'board_game', name: 'Board game', color_class: :orange },
      { key: 'con_services', name: 'Con services', scheduling_ui: 'single_run', color_class: :yellow },
      { key: 'filler', name: 'Filler event', scheduling_ui: 'single_run' },
      { key: 'larp', name: 'Larp', team_member_name: 'GM', color_class: :indigo, can_provide_tickets: true },
      { key: 'meetup', name: 'Meetup', scheduling_ui: 'single_run', team_member_name: 'host' },
      {
        key: 'moderated_discussion',
        name: 'Moderated discussion',
        scheduling_ui: 'single_run',
        team_member_name: 'moderator',
        color_class: :red
      },
      { key: 'panel', name: 'Panel', scheduling_ui: 'single_run', team_member_name: 'panelist', color_class: :red },
      { key: 'party', name: 'Party', scheduling_ui: 'single_run', team_member_name: 'host' },
      {
        key: 'presentation',
        name: 'Presentation',
        scheduling_ui: 'single_run',
        team_member_name: 'presenter',
        color_class: :red
      },
      { key: 'tabletop_rpg', name: 'Tabletop RPG', team_member_name: 'GM', color_class: :teal },
      {
        key: 'town_hall',
        name: 'Town hall',
        scheduling_ui: 'single_run',
        team_member_name: 'facilitator',
        color_class: :green
      },
      {
        key: 'workshop',
        name: 'Workshop',
        scheduling_ui: 'single_run',
        team_member_name: 'facilitator',
        color_class: :red
      },
      { key: 'volunteer_event', name: 'Volunteer event', scheduling_ui: 'recurring', color_class: :grey }
    ].index_by { |category| category[:key] }

  def change
    create_table :event_categories do |t|
      t.references :convention, null: false, foreign_key: true
      t.text :name, null: false
      t.text :team_member_name, null: false
      t.text :scheduling_ui, null: false
      t.text :default_color
      t.text :full_color
      t.text :signed_up_color
      t.boolean :can_provide_tickets, null: false, default: false
      t.references :event_form, null: false, foreign_key: { to_table: 'forms' }
      t.references :event_proposal_form, foreign_key: { to_table: 'forms' }

      t.timestamps
    end

    add_reference :events, :event_category, foreign_key: true
    add_reference :event_proposals, :event_category, foreign_key: true

    reversible do |dir|
      dir.up do
        say 'Adding categories to all events based on legacy category key'

        Event
          .includes(:convention)
          .find_each do |event|
            convention = event.convention
            legacy_category = LEGACY_EVENT_CATEGORIES[event.category]
            event_category =
              convention
                .event_categories
                .find_or_create_by!(name: legacy_category[:name]) do |new_category|
                  new_category.scheduling_ui = legacy_category[:scheduling_ui] || 'regular'
                  new_category.team_member_name = legacy_category[:team_member_name] || 'team member'
                  new_category.can_provide_tickets = legacy_category[:can_provide_tickets] || false

                  if legacy_category[:color_class]
                    color_class = COLOR_CLASSES[legacy_category[:color_class]]
                    new_category.default_color = color_class[:default]
                    new_category.full_color = color_class[:full]
                    new_category.signed_up_color = color_class[:signed_up]
                  end

                  new_category.event_form_id =
                    case legacy_category[:scheduling_ui]
                    when 'recurring'
                      convention.volunteer_event_form_id
                    when 'single_run'
                      convention.filler_event_form_id
                    else
                      convention.regular_event_form_id
                    end

                  if legacy_category[:key] == 'larp'
                    new_category.event_proposal_form_id = convention.event_proposal_form_id
                  end
                end

            event.update!(event_category: event_category)
          end

        say 'Adding event categories to all accepted event proposals'
        execute <<~SQL
          UPDATE event_proposals
          SET event_category_id = events.event_category_id
          FROM events
          WHERE event_proposals.event_id = events.id
        SQL

        say 'Adding the larp event category to all remaining event proposals'
        execute <<~SQL
          UPDATE event_proposals
          SET event_category_id = event_categories.id
          FROM event_categories
          WHERE event_categories.convention_id = event_proposals.convention_id
          AND event_categories.name = 'Larp'
          AND event_proposals.event_category_id IS NULL
        SQL
      end

      dir.down do
        say 'Adding legacy category keys to all events'

        Event
          .includes(:event_category)
          .find_each do |event|
            legacy_category = LEGACY_EVENT_CATEGORIES.values.find { |lc| lc[:name] == event.event_category.name }

            event.update!(category: legacy_category[:key])
          end
      end
    end

    change_column_null :events, :event_category_id, false
    change_column_null :event_proposals, :event_category_id, false
    remove_column :events, :category, :string
  end
end
