class AddSkipClickwrapAgreementToPages < ActiveRecord::Migration[5.2]
  def change
    add_column :pages, :skip_clickwrap_agreement, :boolean, null: false, default: false
  end
end
