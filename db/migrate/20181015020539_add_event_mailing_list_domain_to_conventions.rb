class AddEventMailingListDomainToConventions < ActiveRecord::Migration[5.2]
  def change
    add_column :conventions, :event_mailing_list_domain, :text
  end
end
