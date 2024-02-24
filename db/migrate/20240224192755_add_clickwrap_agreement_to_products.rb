class AddClickwrapAgreementToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :clickwrap_agreement, :text
  end
end
