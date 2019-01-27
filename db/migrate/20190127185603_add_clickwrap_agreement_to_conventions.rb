class AddClickwrapAgreementToConventions < ActiveRecord::Migration[5.2]
  def change
    add_column :conventions, :clickwrap_agreement, :text
  end
end
