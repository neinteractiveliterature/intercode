class AddFormTypeToForms < ActiveRecord::Migration[5.2]
  def change
    add_column :forms, :form_type, :string

    reversible do |dir|
      dir.up do
        execute <<~SQL
          UPDATE forms SET form_type = 'user_con_profile'
          WHERE id IN (SELECT user_con_profile_form_id FROM conventions)
        SQL

        execute <<~SQL
          UPDATE forms SET form_type = 'event_proposal'
          WHERE form_type IS NULL AND (
            id IN (SELECT event_proposal_form_id FROM event_categories)
            OR title ILIKE '%proposal form'
          )
        SQL

        execute <<~SQL
          UPDATE forms SET form_type = 'event'
          WHERE form_type IS NULL AND (
            id IN (SELECT event_form_id FROM event_categories)
            OR title ILIKE '%event form'
          )
        SQL
      end
    end

    change_column_null :forms, :form_type, false
  end
end
