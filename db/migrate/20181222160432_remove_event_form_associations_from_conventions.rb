class RemoveEventFormAssociationsFromConventions < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.down do
        say 'Finding a form to use for each scheduling UI in each convention'
        Convention.includes(:event_categories).find_each do |convention|
          first_category_by_scheduling_ui = convention.event_categories
            .group_by(&:scheduling_ui)
            .transform_values(&:first)

          convention.update!(
            event_proposal_form_id: first_category_by_scheduling_ui['regular']&.event_proposal_form_id,
            regular_event_form_id: first_category_by_scheduling_ui['regular']&.event_form_id,
            volunteer_event_form_id: first_category_by_scheduling_ui['recurring']&.event_form_id,
            filler_event_form_id: first_category_by_scheduling_ui['single_run']&.event_form_id
          )
        end
      end
    end

    remove_reference :conventions, :event_proposal_form, index: true, foreign_key: { to_table: 'forms' }
    remove_reference :conventions, :regular_event_form, index: true, foreign_key: { to_table: 'forms' }
    remove_reference :conventions, :volunteer_event_form, index: true, foreign_key: { to_table: 'forms' }
    remove_reference :conventions, :filler_event_form, index: true, foreign_key: { to_table: 'forms' }
  end
end
