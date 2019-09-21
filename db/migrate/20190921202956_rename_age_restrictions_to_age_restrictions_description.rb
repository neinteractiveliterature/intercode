class RenameAgeRestrictionsToAgeRestrictionsDescription < ActiveRecord::Migration[5.2]
  def change
    rename_column :events, :age_restrictions, :age_restrictions_description
    add_column :events, :minimum_age, :integer, null: true

    EventProposal.find_each do |event_proposal|
      say "Updating additional_info for event proposal #{event_proposal.id}"
      additional_info = event_proposal.additional_info.dup

      reversible do |dir|
        dir.up do
          additional_info['age_restrictions_description'] = additional_info.delete('age_restrictions')
        end
        dir.down do
          additional_info['age_restrictions'] = additional_info.delete('age_restrictions_description')
        end
      end

      event_proposal.update!(additional_info: additional_info)
    end

    FormItem.where(identifier: 'age_restrictions').find_each do |form_item|
      say "Updating form_item #{form_item.id}"
      reversible do |dir|
        dir.up do
          form_item.update!(
            item_type: 'age_restrictions',
            properties: {
              'caption' => form_item.properties['caption'],
              'required' => form_item.properties['required']
            }
          )
        end

        dir.down do
          form_item.update!(item_type: 'free_text')
        end
      end
    end
  end
end
