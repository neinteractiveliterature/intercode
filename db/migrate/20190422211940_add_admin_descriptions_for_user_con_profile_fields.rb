class AddAdminDescriptionsForUserConProfileFields < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        user_con_profile_forms = Form.where(id: Convention.select(:user_con_profile_form_id))
        user_con_profile_form_items = FormItem.where(
          form_section_id: FormSection.where(form_id: user_con_profile_forms.select(:id))
            .select(:id)
        )

        user_con_profile_form_items.where(identifier: 'birth_date', admin_description: nil)
          .update_all(admin_description: 'Birth date')
        user_con_profile_form_items.where(identifier: 'preferred_contact', admin_description: nil)
          .update_all(admin_description: 'Preferred contact')
        user_con_profile_form_items.where(
          identifier: 'receive_whos_free_emails', admin_description: nil
        ).update_all(admin_description: 'Receive emails about openings when I\'m free?')
      end
    end
  end
end
